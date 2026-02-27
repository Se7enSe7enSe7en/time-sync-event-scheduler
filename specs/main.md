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
- no traditional state management — SpacetimeDB subscriptions (`useTable`) are the reactive data source

## Backend

### Architecture: SpacetimeDB Module

The backend is a **SpacetimeDB module** — there is no traditional REST API layer. SpacetimeDB replaces the DB, ORM, cache, and API in one:

```
spacetimedb/
└── src/
    ├── schema.ts      # Table definitions + schema export
    └── index.ts       # Reducers, lifecycle hooks, imports schema
```

#### How SpacetimeDB replaces the old stack

| Old (Supabase/Kysely)              | New (SpacetimeDB)                                   |
| ---------------------------------- | --------------------------------------------------- |
| Prisma schema + migrations         | `table()` definitions in `schema.ts`                |
| Kysely queries in services         | `ctx.db.tableName` access in reducers               |
| REST API routes (`server/api/`)    | Reducers (for writes) + Subscriptions (for reads)   |
| Service layer (`server/services/`) | Business logic lives inside reducers                |
| Auth middleware (`requireAuth`)    | `ctx.sender` (SpacetimeDB Identity)                 |
| `useFetch` / SSE on client         | `useTable(tables.tableName)` reactive subscriptions |

#### Data Flow

```
Client (Vue)                          SpacetimeDB Module
─────────────                         ──────────────────
useTable(tables.X) ◄──subscription──► Tables (reactive)
conn.reducers.doX({...}) ──call────► Reducers (transactional writes)
```

- **Reads**: Clients subscribe to tables → get real-time reactive data via `useTable()`
- **Writes**: Clients call reducers → reducers validate + mutate tables → subscriptions auto-update

#### Conventions

- Schema and tables are defined in `spacetimedb/src/schema.ts`
- Reducers and lifecycle hooks are defined in `spacetimedb/src/index.ts` (imports schema)
- Reducer names come from exports: `export const create_group = spacetimedb.reducer(...)`
- Client calls use object syntax: `conn.reducers.createGroup({ name: '...' })`
- `ctx.sender` is the authenticated user identity — never trust client-provided identity args
- Client bindings are generated into `module_bindings/` via `spacetime generate`

#### Nuxt Server Layer

The `server/` directory is reserved **only** for:

- Proxy routes that need server-side secrets (e.g., N8N webhook triggers, AI API calls)
- Any non-SpacetimeDB integrations that require a traditional HTTP endpoint

It is **NOT** used for CRUD operations — those go through SpacetimeDB reducers and subscriptions.

## Other tools

### Containerization: **Docker**

- Docker: https://docs.docker.com/

### Automation: **N8N**

- n8n: https://docs.n8n.io/

### Authentication: **SpacetimeDB Auth**

- spacetimeDB auth: https://spacetimedb.com/docs/core-concepts/authentication/spacetimeauth/

### AI provider: **Anthropic Claude**

- note: this should be flexible to change in the future, any provider should work but for now we choose Claude.

- Claude Docs: https://platform.claude.com/docs/en/home
