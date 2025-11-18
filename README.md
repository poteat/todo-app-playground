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

2. Copy `.env.example` to `.env` at the repo root and adjust as needed

3. Copy `.env.example` to `.env` at `apps/server/prisma` and adjust as needed

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the Postgres container:

   ```bash
   npm run db:start
   ```

6. Run database migrations and generate the Prisma client types:

   ```bash
   npm run db:migrate   # prisma migrate dev
   npm run db:client    # prisma generate (client in node_modules)
   ```

7. Start the API server and client:

   ```bash
   npm run dev          # runs server + client concurrently
   ```

> **Node version:** The repo enforces Node `24.11.0` via `.nvmrc`, `.npmrc`
> (`engine-strict=true`), and `package.json` engines. Run `nvm use` (or your
> version manager of choice) before installing dependencies.

Environment variables live in `.env` at the repo root (see `.env.example`). The
server expects `DATABASE_URL`, `PORT`, and `CLIENT_ORIGIN`. Vite will read
variables prefixed with `VITE_`. The client uses `VITE_API_BASE_URL` to locate
the API; the example configuration points at `http://localhost:4000/api`.

Prisma CLI reads env vars from a `.env` file next to `schema.prisma` (the
`apps/server/prisma/.env` you created above). The app itself uses the root
`.env` when running.

> Postgres persists data under `docker/db-data/pgdata` (the container uses
> `PGDATA=/var/lib/postgresql/data/pgdata`). You can keep other files (like
> `.DS_Store` or `.gitkeep`) in `docker/db-data` without breaking init. If you
> ever see initdb errors, remove `docker/db-data/pgdata` and start again.

## Development Scripts

From the repo root:

```bash
npm run dev           # run server + client concurrently

npm run db:start      # start Postgres (Docker)
npm run db:stop       # stop Postgres container
npm run db:clear      # stop Postgres and remove local data volume
npm run db:migrate    # run Prisma migrations against the DB
npm run db:client     # regenerate Prisma client/types into node_modules
npm run db:studio     # open Prisma Studio UI

npm run typecheck     # TypeScript project references build (no emit)
npm run lint          # alias for typecheck
npm run build         # build all workspaces
```

To work with individual workspaces:

```bash
npm --workspace apps/server run dev
npm --workspace apps/client run dev
```

## Path Aliases

- `@/` – resolves to the `src` directory of the workspace you are in (apps or
  packages)

Server scripts load aliases via `tsconfig-paths` both in development and when
the compiled code runs, so feel free to use them in API code as well.

## Updating Dependencies

- `npm run upgrade` – runs `npm-check-updates` across all workspaces and then
  reinstalls dependencies to refresh `package-lock.json`.
