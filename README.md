# Parabellum

Monorepo for the Parabellum web platform, built with [Nx](https://nx.dev).

## Apps

| App | Description |
|-----|-------------|
| `apps/web` | Next.js frontend (SSG + ISR, bilingual EN/RU) |
| `apps/strapi` | Strapi CMS — content source for the web app |

## Quick start

```sh
pnpm docker:up          # Start PostgreSQL
pnpm dev                # Start Strapi + web in parallel
```

## Common tasks

```sh
# Build all apps
pnpm nx run-many -t build

# Build / dev a single app
pnpm nx build web
pnpm nx dev strapi

# Generate Strapi TypeScript types
pnpm nx run strapi:generate-types

# Seed Strapi with initial map data (Strapi must be running)
pnpm nx run strapi:seed

# Run a specific target
pnpm nx <target> <project>
```

Targets are defined in each project's `project.json` or inferred by Nx plugins.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

- **Strapi** deploys to [Strapi Cloud](https://strapi.io/cloud) via `strapi deploy`
- **Web** deploys to [Vercel](https://vercel.com) via `vercel --prod`

## Architecture

### Rendering strategy (`apps/web`)

The web app uses **SSG (Static Site Generation) with ISR (Incremental Static Regeneration)**. Pages are pre-built at deploy time and revalidated every 5 minutes in the background — users always receive a fast static response with no live API calls at request time.

This is enforced by three layers:

**1. `generateStaticParams` in the root layout**
All pages live under the `[locale]` segment. The root layout exports `generateStaticParams` to pre-build every route for both locales (`en`, `ru`) at build time, which cascades down to all child pages.

**2. `revalidate = 300` on pages**
Pages declare a 5-minute ISR revalidation window instead of opting into dynamic rendering. Next.js regenerates stale pages in the background after the window expires.

**3. `unstable_cache` on all Strapi data fetching**
Every function in `src/lib/strapi/index.ts` that calls the Strapi API is wrapped with `unstable_cache` at the same 5-minute interval. No Strapi requests are made at request time — data is always served from the Next.js data cache.

To make a specific route dynamic, export `dynamic = 'force-dynamic'` from that page or set `revalidate = 0`.

## Nx Cloud

Connect to Nx Cloud for remote caching and faster CI:

```sh
pnpm nx connect
```