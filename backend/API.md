# Invest Care CMS — API reference

Base URL: `http://localhost:5000/api` · production `https://api.investcare.com.np/api`

Every response is one of:

```jsonc
{ "success": true,  "data": … }                    // or "message"
{ "success": false, "error": { "message": "…", "details": { … } } }
```

`details` carries per-field validation errors: `{ "name": "is required" }`.

---

## Public API — no authentication

These are safe to call from the website, from a build script, or from a
browser. They return **published rows only** — unpublishing a record removes it
from these responses entirely.

| Method | Endpoint | Returns |
| --- | --- | --- |
| `GET` | `/api/health` | Service status |
| `GET` | `/api/public/site` | **The whole site in one payload** |
| `GET` | `/api/public/board` | Board members |
| `GET` | `/api/public/sectors` | Sector allocation |
| `GET` | `/api/public/portfolio` | Portfolio companies |
| `GET` | `/api/public/roadmap` | Path-to-listing milestones |
| `GET` | `/api/public/benchmarks` | Global comparables |
| `GET` | `/api/public/jobs` | Open roles |
| `GET` | `/api/public/settings` | Singleton documents |
| `GET` | `/api/public/blocks/:group` | One content list |
| `POST` | `/api/public/enquiries` | **Contact form submission** |
| `GET` | `/uploads/:filename` | An uploaded image |

Reads are limited to 120 requests per minute per IP. `POST /public/enquiries`
is limited to 8 per hour per IP.

### `GET /api/public/site`

The endpoint the website actually uses. One request, everything rendered:

```jsonc
{
  "success": true,
  "data": {
    "company":        { "name", "shortName", "tagline", "intro", "mission", "vision", … },
    "incorporation":  { "summary", "details": [{ "label", "value" }], "governancePillars": [] },
    "contact":        { "office", "email", "phones": [{ "name", "number" }] },
    "values":         [{ "title", "body" }],
    "capital":        { "bars": [], "buildUp": [], "buildUpTotal": {}, "ask": {} },
    "investorQuote":  { "text", "attribution" },
    "seo":            { "title", "description", "ogImage" },

    "board":          [{ "id", "slug", "name", "role", "credentials", "bio", "image" }],
    "sectors":        [{ "id", "slug", "name", "share", "icon", "color", "body" }],
    "portfolio":      [{ "id", "slug", "name", "brand", "sector", "metrics": [], "image", … }],
    "portfolioStats": [{ "value", "label" }],
    "roadmap":        [{ "id", "date", "title", "detail" }],
    "benchmarks":     [{ "id", "name", "country", "figure", "points": [] }],
    "jobs":           [{ "id", "slug", "title", "location", "requirements": [], … }],

    "holdingPrinciples": ["…"],
    "nepalStats":        [{ "value", "label" }],
    "nepalMomentum":     ["…"],
    "nepalWhyNow":       ["…"],

    "landing": {
      "ticker":              ["…"],
      "stats":               [{ "value", "label" }],
      "valueProps":          [{ "title", "body" }],
      "investorCommitments": [{ "title", "body" }]
    }
  }
}
```

### `POST /api/public/enquiries`

```jsonc
{ "name": "…", "email": "…", "phone": "…", "subject": "…", "message": "…" }
```

`name`, `email` and `message` are required; `message` caps at 5000 characters.
Returns `201` with a thank-you message and **no record id** — a public endpoint
should not hand back identifiers it does not need to.

---

## Authenticated API

Send `Authorization: Bearer <token>` on every request below. A missing or
expired token returns `401`.

### Auth

| Method | Endpoint | Notes |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Public. 10 attempts per IP per 15 min |
| `GET` | `/api/auth/me` | Current user |
| `POST` | `/api/auth/logout` | |
| `POST` | `/api/auth/change-password` | |

### The CMS describes itself

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/api/admin/schema` | Tabs, sections and field definitions |

The admin UI builds its navigation and forms from this, so adding a section to
`cms-schema.js` surfaces it in the CMS with no frontend change.

### Singleton documents

| Method | Endpoint |
| --- | --- |
| `GET` | `/api/admin/settings` |
| `GET` | `/api/admin/settings/:key` |
| `PUT` | `/api/admin/settings/:key` |

Keys: `company`, `incorporation`, `contact`, `capital`, `investorQuote`, `seo`.
Any other key is rejected, so a typo cannot create an orphan row.

### Content lists (blocks)

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/api/admin/blocks/:group` | |
| `PUT` | `/api/admin/blocks/:group` | **Replace the whole list** — one Save button |
| `POST` | `/api/admin/blocks/:group` | Append one row |
| `POST` | `/api/admin/blocks/:group/reorder` | `{ "ids": [...] }` |
| `PATCH` | `/api/admin/blocks/item/:id` | |
| `DELETE` | `/api/admin/blocks/item/:id` | |

Groups: `company.values`, `incorporation.details`, `incorporation.governance`,
`contact.phones`, `portfolio.stats`, `invest.holdingPrinciples`,
`invest.nepalStats`, `invest.nepalMomentum`, `invest.nepalWhyNow`,
`landing.ticker`, `landing.stats`, `landing.valueProps`,
`landing.investorCommitments`.

### Record collections

Each of these has the identical six endpoints:

```
GET    /api/admin/<name>          list
GET    /api/admin/<name>/:id      one
POST   /api/admin/<name>          create      → 201
PATCH  /api/admin/<name>/:id      update
DELETE /api/admin/<name>/:id      delete
POST   /api/admin/<name>/reorder  { "ids": [...] }
```

`<name>` is one of `board`, `sectors`, `portfolio`, `roadmap`, `benchmarks`,
`jobs`.

Notes that apply to all of them:

- `?q=` filters the list by the resource's searchable fields.
- `slug` is generated from the name/title and de-duplicated (`-2`, `-3`).
- `isPublished: false` hides a row from the public API without deleting it.
- New rows are appended to the end of the order.

### Enquiries

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/api/admin/enquiries` | `?status=` `?q=`. Returns `{ items, counts }` |
| `PATCH` | `/api/admin/enquiries/:id` | `{ "status": "read" \| "replied" \| "archived", "notes": "…" }` |
| `DELETE` | `/api/admin/enquiries/:id` | |

### Media

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/api/admin/media` | |
| `POST` | `/api/admin/media` | `multipart/form-data`, field `file` |
| `DELETE` | `/api/admin/media/:id` | Removes the row and the file |

JPEG, PNG, WebP, AVIF and SVG, up to 5 MB. Filenames are regenerated from a
slug plus a random suffix — the client's filename never reaches the disk.

---

## Status codes

| Code | Meaning |
| --- | --- |
| `200` / `201` | Fine |
| `400` | Validation failed — read `error.details` |
| `401` | No token, expired token, or wrong credentials |
| `403` | Account disabled |
| `404` | No such record |
| `409` | Slug or email already in use |
| `429` | Rate limited |
| `500` | Bug. The real message is logged server-side, not returned in production |
