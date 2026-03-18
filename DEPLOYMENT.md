# Deployment

Two apps to deploy independently: **Strapi** (CMS) and **web** (Next.js frontend).

---

## 1. Strapi → Strapi Cloud

The project is already linked to a Strapi Cloud project (`apps/strapi/.strapi-cloud.json`).

**Prerequisites:** Strapi Cloud account with the `parabellum-94f1c7a04e` project created.

```sh
# Build the admin panel, then deploy
pnpm nx build strapi
cd apps/strapi && pnpm strapi deploy
```

In the Strapi Cloud dashboard, set these environment variables:

```
APP_KEYS=<two comma-separated random strings>
API_TOKEN_SALT=<random string>
ADMIN_JWT_SECRET=<random string>
TRANSFER_TOKEN_SALT=<random string>
JWT_SECRET=<random string>
ENCRYPTION_KEY=<random string>
DATABASE_CLIENT=postgres
DATABASE_HOST=<your postgres host>
DATABASE_PORT=5432
DATABASE_NAME=<db name>
DATABASE_USERNAME=<db user>
DATABASE_PASSWORD=<db password>
DATABASE_SSL=true
```

Strapi Cloud provides a managed PostgreSQL add-on — provision it in the dashboard and it will inject the `DATABASE_*` vars automatically.

After deploy, note the public Strapi URL (e.g. `https://parabellum-94f1c7a04e.strapiapp.com`).

---

## 2. Seed data (first deploy only)

Once Strapi is live, create a full-access API token in the Strapi admin, update the `TOKEN` constant in `apps/strapi/seed-map-data.mjs`, then:

```sh
# Strapi must be running and reachable
pnpm nx run strapi:seed
```

---

## 3. Web → Vercel

**Prerequisites:** Vercel account, `vercel` CLI installed (`npm i -g vercel`).

```sh
# One-time project link
vercel link

# Deploy
pnpm nx build web
vercel --prod
```

Set these environment variables in the Vercel dashboard (or via `vercel env add`):

```
NEXT_PUBLIC_STRAPI_URL=https://<your-strapi-cloud-url>
STRAPI_API_TOKEN=<full-access API token from Strapi admin>
```

The web app builds statically at deploy time and revalidates pages every 5 minutes via ISR — no runtime connection to Strapi is needed after build.

---

## Local development recap

```sh
pnpm docker:up          # Start PostgreSQL
pnpm dev                # Start Strapi + web in parallel
```

See `.env.example` and `apps/strapi/.env.example` for required local env vars.
