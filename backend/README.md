# Invest Care — CMS Backend

Node.js + Express + PostgreSQL API for the Invest Care CMS. Scope right now is
**authentication only** (login / session / logout). Content endpoints get added
later as new folders under `src/modules/`.

## Stack

| Concern        | Choice                                |
| -------------- | ------------------------------------- |
| Runtime        | Node.js 22 (ESM, `"type": "module"`)  |
| Framework      | Express 5                             |
| Database       | PostgreSQL 16 via `pg` (raw SQL, no ORM) |
| Auth           | JWT bearer tokens, bcrypt hashing     |
| Hardening      | helmet, CORS allowlist, login rate limit |

## Layout

```
backend/
├── .env.example              template for local config
└── src/
    ├── server.js             boot: verify DB, listen, graceful shutdown
    ├── app.js                express app: middleware + route mounting
    ├── config/env.js         reads and validates environment variables
    ├── db/
    │   ├── pool.js           shared pg connection pool
    │   ├── schema.sql        table definitions (idempotent)
    │   ├── migrate.js        applies schema.sql
    │   └── seed.js           creates/updates the admin user
    ├── middleware/
    │   ├── requireAuth.js    verifies Bearer token, loads req.user
    │   ├── rateLimit.js      login throttling
    │   └── errorHandler.js   404 + central error responses
    ├── modules/auth/         routes → controller → service
    └── utils/                ApiError, asyncHandler
```

Each module keeps the same three layers: **routes** (paths + middleware),
**controller** (validate input, shape the response), **service** (SQL and
business rules). Add a CMS resource by copying that shape.

## Setup

```bash
cd backend
npm install
cp .env.example .env          # then edit it

# create the database (once)
createdb investcare_cms       # or: psql -c "CREATE DATABASE investcare_cms;"

npm run db:setup              # migrate + seed admin
npm run dev                   # http://localhost:5000
```

Generate a real `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Scripts

| Command              | Does                                      |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | start with file watching                  |
| `npm start`          | start normally                            |
| `npm run db:migrate` | apply `src/db/schema.sql`                 |
| `npm run db:seed`    | create/reset the admin from `SEED_ADMIN_*`|
| `npm run db:setup`   | migrate + seed                            |

## API

Base URL: `http://localhost:5000/api`

Every response is `{ success: true, data|message }` or
`{ success: false, error: { message } }`.

### `GET /health`

```json
{ "success": true, "status": "ok", "env": "development" }
```

### `POST /auth/login`

```json
{ "email": "admin@gmail.com", "password": "P@ssw0rd" }
```

→ `200`

```json
{
  "success": true,
  "data": {
    "user": { "id": "…", "name": "Administrator", "email": "…", "role": "admin" },
    "token": "eyJhbGciOi…"
  }
}
```

→ `400` missing fields · `401` wrong email or password · `403` account disabled
· `429` more than 10 attempts from one IP in 15 minutes.

### `GET /auth/me` — *auth required*

Returns the current user. Use it on CMS load to restore the session.

### `POST /auth/logout` — *auth required*

Tokens are stateless, so the client discards the token; this endpoint gives the
CMS one place to call and a hook for a future token denylist.

### `POST /auth/change-password` — *auth required*

```json
{ "currentPassword": "P@ssw0rd", "newPassword": "at-least-8-chars" }
```

### Authenticating requests

```
Authorization: Bearer <token>
```

Example from the frontend:

```js
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { data } = await res.json();
localStorage.setItem("token", data.token);
```

## Security notes

- Passwords are bcrypt hashed (12 rounds); hashes never leave the service layer.
- A wrong email and a wrong password take the same time and return the same
  message, so the API does not reveal which accounts exist.
- All SQL uses parameterised placeholders (`$1`), never string concatenation.
- `CORS_ORIGIN` is an allowlist — add the deployed CMS origin before going live.
- `.env` is gitignored. Change `SEED_ADMIN_PASSWORD` before any real deployment.

## Adding CMS content endpoints later

1. Add the table to `src/db/schema.sql`, run `npm run db:migrate`.
2. Create `src/modules/<resource>/` with `.routes.js`, `.controller.js`,
   `.service.js`.
3. Mount it in `src/app.js`: `app.use("/api/<resource>", <resource>Routes)`.
4. Put `requireAuth` on any write route.
