# Progress Log

## 2026-01-22 - Project Specs & Initialization

- **Analysed Specs:** Reviewed project requirements for a Time Sync Event Scheduler.
- **Tech Stack Confirmed:** Nuxt 4, Supabase (Auth + DB), Prisma + Kysely, Tailwind, N8N, Gemini AI.
- **Initialized Nuxt 4:** Created a fresh Nuxt 4 project with `@latest` and added Tailwind CSS module.
  ```bash
  npx nuxi@latest init . --force
  npx nuxi@latest module add tailwindcss
  ```
- **Installed Backend Deps:** Set up `prisma`, `prisma-kysely`, `kysely`, and `pg`.
  ```bash
  npm install -D prisma prisma-kysely
  npm install kysely pg
  npx prisma init
  ```

## 2026-01-23 - Database & Environment Setup

- **Configured Prisma+Kysely:**
  - Created `prisma/schema.prisma` using `prisma-kysely` generator.
  - Configured `server/types` as output for generated types.
  - Updated `prisma.config.ts` to manage usage of `DATABASE_URL`.
- **Initialized Local DB (Supabase):**
  - Verified usage of `npx supabase init` and `start` to spin up local Dockerized Postgres + Auth.
  - Updated `.env` with local Supabase credentials (URL, Anon Key, DB URL).
  ```bash
  npx supabase init
  npx supabase start
  ```
- **Created First Schema:** Added `Profile` model to `schema.prisma`.
- **Implemented Server DB Client:** Created `server/utils/db.ts` to instantiate Kysely with the Postgres dialect.
- **Verified End-to-End:**
  - Created `server/api/test-db.get.ts` to test database writes (Insert) and reads (Select).
  - Confirmed successful API response.
  ```bash
  npm run dev
  ```

## 2026-01-26 - Authentication Prep

- **Installed Nuxt Supabase Module:** Added `@nuxtjs/supabase` for frontend auth composables.
  ```bash
  npx nuxi@latest module add supabase
  ```
- **Configured Nuxt:** Updated `nuxt.config.ts` to include the Supabase module and disable automatic redirects (for manual control).

## 2026-01-28 - Local Supabase CLI Setup

- **Installing Supabase CLI:** Installing the Supabase CLI as a dev dependency via pnpm.
  ```bash
  pnpm add -D supabase
  ```
- **Starting Local Supabase:** Spinning up the local database and services using the local CLI instance.
  ```bash
  npx supabase start
  ```
