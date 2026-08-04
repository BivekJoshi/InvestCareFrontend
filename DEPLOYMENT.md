# Deploying to Babal Host (cPanel)

Push to `main` → GitHub Actions builds both halves → uploads over FTPS → live.

```
                       investcare.com.np
                              │
              ┌───────────────┴────────────────┐
              │                                │
      /public_html                   api.investcare.com.np
      static HTML, CSS, JS           cPanel Node.js App (Passenger)
      no Node process                Express + node_modules
                                              │
                                              ▼
                                     Neon — managed PostgreSQL
```

**Why the site is static.** Every page in this project already prerenders — no
route handlers, no server actions, no middleware, no dynamic segments. Serving
it as plain files means nothing to crash, no memory limit to hit, and no Node
process to keep alive. `npm run build:static` produces `out/`, which is the
entire website.

**Why the database is external.** cPanel's standard database is MySQL, and
PostgreSQL is usually not enabled on shared plans. Neon's free tier is
PostgreSQL, so the backend runs unchanged. If Babal Host confirms PostgreSQL is
available, swap `DATABASE_URL` for the local `PG*` values — nothing else
changes.

---

## One-time setup

### 1. Create the database (Neon)

1. Sign up at <https://neon.tech> and create a project — pick the region
   closest to Nepal (Singapore).
2. Create a database named `investcare_cms`.
3. Copy the connection string. It looks like:
   ```
   postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/investcare_cms?sslmode=require
   ```

### 2. Create the tables and the admin user

Run this **from your laptop** — it connects to Neon over the internet, so the
server does not need to run anything:

```bash
cd backend
DATABASE_URL='postgresql://…your Neon string…' \
DB_SSL=true \
SEED_ADMIN_EMAIL='admin@investcare.com.np' \
SEED_ADMIN_PASSWORD='<a strong password>' \
npm run db:setup
```

Expected:
```
[migrate] schema applied
[seed] admin ready: admin@investcare.com.np
```

> Use a real password here. `P@ssw0rd` is fine locally, not in production.

### 3. Create the API subdomain

cPanel → **Domains** → **Create A New Domain**

| Field | Value |
| --- | --- |
| Domain | `api.investcare.com.np` |
| Document Root | `api.investcare.com.np` (leave the default) |

### 4. Create the Node.js application

cPanel → **Software** → **Setup Node.js App** → **Create Application**

| Field | Value |
| --- | --- |
| Node.js version | 20 or 22 |
| Application mode | Production |
| Application root | `investcare-api` |
| Application URL | `api.investcare.com.np` |
| Application startup file | `src/server.js` |

Then add the environment variables in the same panel:

| Name | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | your Neon connection string |
| `DB_SSL` | `true` |
| `JWT_SECRET` | generate one — see below |
| `JWT_EXPIRES_IN` | `1d` |
| `BCRYPT_ROUNDS` | `12` |
| `CORS_ORIGIN` | `https://investcare.com.np` |

Generate the secret locally and paste the result:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> Do **not** upload `backend/.env`. The deploy excludes it on purpose —
> production secrets belong in the cPanel panel, not in the repo.

`PORT` is set by Passenger. Do not add it.

### 5. Add the GitHub secrets

Repo → **Settings** → **Secrets and variables** → **Actions**

Under **Secrets**:

| Name | Value |
| --- | --- |
| `FTP_SERVER` | `ftp.investcare.com.np` (or the server IP from cPanel) |
| `FTP_USERNAME` | your cPanel user, or a dedicated FTP account |
| `FTP_PASSWORD` | that account's password |
| `FTP_API_DIR` | `/investcare-api/` |

Under **Variables**:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://api.investcare.com.np/api` |

> Create a **separate FTP account** in cPanel rather than using your main
> login. If the token leaks, you revoke one FTP account instead of rotating
> your whole hosting password.

### 6. First deploy

```bash
git push origin main
```

Watch it under the repo's **Actions** tab. Two jobs run in parallel: the static
site to `public_html`, and the API source to `investcare-api`.

### 7. Install the API's dependencies

FTP cannot run commands, so the first install is manual:

cPanel → **Setup Node.js App** → your app → **Run NPM Install** → **Restart**

You only repeat this when `backend/package.json` changes. Ordinary code
deploys restart automatically (see below).

### 8. Enable HTTPS

cPanel → **SSL/TLS Status** → select both `investcare.com.np` and
`api.investcare.com.np` → **Run AutoSSL**.

Both need certificates. The browser will block API calls from an HTTPS site to
an HTTP API.

---

## Deploying after that

```bash
git push origin main
```

That's it. The frontend job rebuilds and uploads only changed files. The
backend job uploads changed source and writes `backend/tmp/restart.txt` with
the commit SHA — Passenger watches that file and restarts the app when it
changes, so the API picks up new code without you touching cPanel.

To redeploy without a code change, use **Actions → Deploy to cPanel → Run
workflow**.

## Verifying a deploy

```bash
curl -I https://investcare.com.np/                 # 200, and HTTPS
curl -I https://investcare.com.np/does-not-exist   # 404
curl https://api.investcare.com.np/api/health      # {"success":true,...}
```

Then open <https://investcare.com.np/admin/login> and sign in.

## Rolling back

```bash
git revert <bad-commit>
git push origin main
```

The pipeline redeploys the previous state. There is no "undo" button in
cPanel — the repo is the source of truth.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Site loads, CMS login says *"Cannot reach the server"* | `NEXT_PUBLIC_API_URL` wrong, or the API is down | `curl https://api.investcare.com.np/api/health`; the variable is baked in at build time, so fix it and re-run the workflow |
| Login fails only in the browser, works in `curl` | CORS | `CORS_ORIGIN` in cPanel must be exactly `https://investcare.com.np` — no trailing slash |
| API returns 503 | Passenger cannot start the app | cPanel → Setup Node.js App → check the log. Usually a missing env var or `node_modules` |
| `Missing required environment variable(s): JWT_SECRET` | Env var not set in cPanel | Add it in the Node.js App panel, restart |
| API can't connect to the database | Neon needs TLS | `DB_SSL=true` must be set |
| Pages 404 except the homepage | `.htaccess` missing from `public_html` | The workflow copies it from `deploy/public_html.htaccess`; confirm it uploaded |
| Deploy succeeds but the site is unchanged | Browser or host cache | Hard-refresh. HTML is sent `must-revalidate`, assets are fingerprinted |
| FTP job fails with a TLS error | Host wants plain FTP | Change `protocol: ftps` to `ftp` in the workflow — but ask Babal Host to enable FTPS first, plain FTP sends your password in clear text |

## What lives where

| Path | Purpose |
| --- | --- |
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | The pipeline |
| [deploy/public_html.htaccess](deploy/public_html.htaccess) | Apache rules — HTTPS, clean URLs, 404, caching |
| [next.config.mjs](next.config.mjs) | `BUILD_TARGET=static` switches on the export |
| `out/` | Build output. Not committed |
