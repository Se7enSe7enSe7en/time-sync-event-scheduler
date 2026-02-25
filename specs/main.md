# Project description

AI automation scheduler for self time management or small time event organizing like scheduled gaming sessions with friends.

## Core features

- a dashboard where you can see the current upcoming event in the group you are in
- group or lobby system where users can join and the next event will be scheduled
- once inside a group, UI for making schedule should should be able to see all other user's (within the group) timezones
- the UI for making schedule should somehow highlight the possible time slots where everyone is available
- users can input their availability time through their profile, can be set outside of the group

## Extra features

- notification system through email, use n8n to email automatically the users within the group 2 days before the event
- AI chatbot that can schedule events for the group based on the users' availability

# Tech stack

## Frontend

### Full stack framework: **nuxt**

- Nuxt: https://nuxt.com/docs/4.x/getting-started/introduction

#### Nuxt desired specs

- nuxt 4
- pnpm
- Typescript: https://www.typescriptlang.org/
- Vue3 composition api: https://vuejs.org/api/composition-api-setup.html#composition-api-setup
- tailwind: https://tailwindcss.com/
- no state management, use Fetch or SSE if posible

## Backend

### Architecture: 3-Layer Pattern

The backend follows a **thin handler → service → utils/db** architecture:

```
server/
├── api/                    # Layer 1: Thin Handlers (HTTP concerns only)
│   └── *.ts                #   → Auth, validation, call service, return response
├── services/               # Layer 2: Business Logic
│   └── *.service.ts        #   → Domain rules, orchestration, reusable logic
├── utils/                  # Layer 3: Utilities (auto-imported by Nuxt)
│   └── db.ts               #   → Kysely instance, generic helpers
└── types/
    └── db.d.ts             # Generated Kysely types from Prisma
```

#### Layer Responsibilities

| Layer                            | Does                                                                                                       | Does NOT                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **API Handler** (`server/api/`)  | Auth (`serverSupabaseUser`), parse/validate body, extract route params, call service, return HTTP response | Contain business logic, directly query DB         |
| **Service** (`server/services/`) | Business logic, DB queries via Kysely, orchestrate transactions, throw domain errors                       | Know about HTTP, parse requests, format responses |
| **Utils** (`server/utils/`)      | Provide generic helpers, DB connection, auto-imported by Nuxt                                              | Contain domain-specific business logic            |

#### Conventions

- Service files are named `<domain>.service.ts` (e.g., `profile.service.ts`)
- Each service exports an object with methods (e.g., `export const profileService = { ... }`)
- Services receive plain data as arguments (not the H3 event object)
- Services throw errors using `createError()` for domain-level failures (e.g., "Profile not found")
- A shared `requireAuth` utility extracts and validates the user from the event

### ORM + query builder + adapter: **prisma-kysely**

- (Adapter) prisma-kysely: https://github.com/valtyr/prisma-kysely
- (ORM) prisma: https://www.prisma.io/docs/guides/nuxt
- (Query Builder) kysely: https://kysely.dev/docs/intro

### DB: **supabase + postgresql**

- postgresql: https://www.postgresql.org/docs/16/index.html

## Other tools

### Containerization: **Docker**

- Docker: https://docs.docker.com/

### Automation: **N8N**

- n8n: https://docs.n8n.io/

### Authentication: **Supabase Auth**

- supabase auth: https://supabase.com/docs/guides/auth

### AI provider: **Google Gemini**

- note: this should be flexible to change in the future any provider should work but for now we choose gemini.

- Gemini: https://ai.google.dev/gemini-api/docs
