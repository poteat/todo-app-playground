# Todo App Playground

Low-abstraction monorepo that hosts an Express API, React (Vite) client, shared
TypeScript utilities, and a Dockerized Postgres instance for local development.

- Todo API: Express 5 + Prisma + Postgres
- Todo UI: Vite + React + Jotai
- Shared contracts: TypeScript types shared between client and server

## Structure

- `apps/server` – Express API + Prisma client
- `apps/client` – React app bootstrapped with Vite
- `packages/shared` – Cross-cutting TypeScript helpers and schema definitions
- `docker-compose.yml` – Local Postgres service

## Getting Started

1. Ensure you are on the expected Node version and have Docker running:

   ```bash
   nvm use          # or your Node version manager of choice
   # start Docker Desktop / docker daemon
   ```

2. Copy `.env.example` to `.env` and adjust as needed (database URL, ports,
   etc.).

3. Install dependencies and start everything:

```bash
npm install
npm run dev       # boots Postgres then runs server + client concurrently
```

> `npm run dev` always starts the local Postgres container via Docker Compose.
> Ensure Docker Desktop (or your Docker daemon) is running first.

> **Node version:** The repo enforces Node `24.11.0` via `.nvmrc`, `.npmrc`
> (`engine-strict=true`), and `package.json` engines. Run `nvm use` (or your
> version manager of choice) before installing dependencies.

Environment variables live in `.env` at the repo root (see `.env.example`). The
server expects `DATABASE_URL`, `PORT`, and `CLIENT_ORIGIN`. Vite will read
variables prefixed with `VITE_`. The client uses `VITE_API_BASE_URL` to locate
the API; the example configuration points at `http://localhost:4000/api`.

Prisma CLI reads env vars from a `.env` file next to `schema.prisma`. To support
`prisma migrate dev` and `prisma generate`, the repo includes
`apps/server/prisma/.env` with only `DATABASE_URL`. The app itself uses the root
`.env` when running.

> Postgres persists data under `docker/db-data/pgdata` (the container uses
> `PGDATA=/var/lib/postgresql/data/pgdata`). You can keep other files (like
> `.DS_Store` or `.gitkeep`) in `docker/db-data` without breaking init. If you
> ever see initdb errors, remove `docker/db-data/pgdata` and start again.

## Development Scripts

From the repo root:

```bash
npm run dev         # db + server + client
npm run lint        # TypeScript typecheck across all workspaces
npm run typecheck   # alias for lint
npm run build       # build all workspaces
npm run clean       # remove dist, tsbuildinfo, all node_modules
```

To work with individual workspaces:

```bash
npm --workspace apps/server run dev
npm --workspace apps/client run dev

npm --workspace apps/server run prisma:migrate
```

## Path Aliases

- `@/shared` – resolves to the shared workspace (`packages/shared/src`)
- `@@/` – resolves to the `src` directory of the workspace you are in (apps or
  packages)

Server scripts load aliases via `tsconfig-paths` both in development and when
the compiled code runs, so feel free to use them in API code as well.

## Updating Dependencies

- `npm run upgrade` – sequentially runs `npm-check-updates` for the root
  workspace plus each app/package, then reinstalls to refresh
  `package-lock.json`.
- `npm run upgrade:server` (or `upgrade:client`, `upgrade:shared`,
  `upgrade:root`) – update a single workspace’s `package.json`; run
  `npm install` afterward to sync the lockfile.
