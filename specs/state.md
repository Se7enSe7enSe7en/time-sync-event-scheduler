# Implementation Plan

Based on `specs/main.md` and `specs/erd.md`, this plan outlines the steps to build the Time Sync Event Scheduler using **SpacetimeDB**.

> **Migration note:** The project was previously built with Supabase + Prisma + Kysely.
> That legacy code has been removed. Frontend pages now contain commented SpacetimeDB
> scaffolds with TODO guides for implementation.

---

## Phase 1: Foundation — SpacetimeDB Schema & Cleanup

- [ ] **Define SpacetimeDB tables** in `spacetimedb/src/schema.ts`
  - `Profile` (identity PK, email, name, timezone, timestamps)
  - `Group` (u64 PK, name, description, code, owner_id, timestamps)
  - `GroupMember` (u64 PK, group_id, profile_id, role, joined_at)
  - `Availability` (u64 PK, profile_id, day_of_week, start_time, end_time)
  - `Event` (u64 PK, group_id, title, description, start/end times, location, timestamps)
  - Add indexes as documented in `specs/erd.md`
- [ ] **Define core reducers** in `spacetimedb/src/index.ts`
  - Lifecycle: `clientConnected`, `clientDisconnected`
  - Profile: `create_profile`, `update_profile`
  - Group: `create_group`, `join_group`, `leave_group`
  - GroupMember: managed by group reducers
  - Availability: `set_availability` (bulk replace for a profile)
  - Event: `create_event`, `update_event`, `delete_event`
- [ ] **Publish module** to local SpacetimeDB and generate client bindings
  - `spacetime publish --module-path spacetimedb --server local`
  - `spacetime generate --lang typescript --out-dir module_bindings --module-path spacetimedb`
- [x] **Remove legacy Supabase code**
  - ~~Delete `server/api/` (old REST endpoints)~~ ✅ Removed
  - ~~Delete `server/services/` (old service layer)~~ ✅ Removed
  - ~~Delete `server/utils/db.ts`, `server/utils/ensureProfile.ts`, `server/utils/requireAuth.ts`~~ ✅ Removed
  - ~~Delete `shared/types/` (will be replaced by generated module bindings)~~ ✅ Removed
  - ~~Delete `app/plugins/auto-profile.client.ts` (Supabase watcher)~~ ✅ Removed
  - ~~Delete `app/pages/confirm.vue` (Supabase OTP flow)~~ ✅ Removed
  - ~~Delete `app/pages/spacetimedb-example-page.vue` (boilerplate)~~ ✅ Removed
  - ~~Update `nuxt.config.ts`, `.env.local`, `docs/setting-up.md`~~ ✅ Done
- [x] **Scaffold frontend pages with SpacetimeDB TODOs**
  - `app/middleware/auth.ts` — no-op scaffold with SpacetimeDB Identity TODO
  - `app/pages/login.vue` — connect page scaffold
  - `app/pages/dashboard.vue` — placeholder with commented useTable/useSpacetimeDB
  - `app/pages/profile.vue` — full UI preserved, data layer replaced with TODO comments
  - `app/pages/groups/index.vue` — full UI preserved, fetch → reducer TODOs
  - `app/pages/groups/[id].vue` — full UI preserved, subscription TODOs

## Phase 2: Core Feature — User Profile & Availability

- [ ] **Client: Profile management**
  - Auto-create profile on connect via `clientConnected` lifecycle hook
  - `/profile` page: edit name, timezone using `conn.reducers.updateProfile({...})`
  - Display profile data via `useTable(tables.Profile)`
- [ ] **Client: Availability management**
  - `/profile` page (or sub-section): availability slot editor
  - Call `conn.reducers.setAvailability({...})` to save slots
  - Display current availability via `useTable(tables.Availability)`

## Phase 3: Core Feature — Groups/Lobbies

- [ ] **Client: Group management**
  - `/groups` page: list user's groups via subscription
  - Create group: call `conn.reducers.createGroup({...})`
  - Join group: call `conn.reducers.joinGroup({ code: '...' })`
  - `/groups/[id]` page: group details + member list via subscriptions
- [ ] **Subscriptions**
  - Subscribe to relevant tables filtered by user context
  - Member list, group info — all driven by `useTable()`

## Phase 4: Core Feature — Scheduling Logic

- [ ] **Client: Scheduling algorithm**
  - Fetch availability of all group members (via subscription to `Availability` table)
  - Calculate overlapping free time slots (considering timezones)
  - Visualize "Heatmap" or "Free Slots" on a calendar
- [ ] **Client: Event creation**
  - `GroupScheduler` component: the main scheduling UI
  - Call `conn.reducers.createEvent({...})` to schedule
  - Events appear in real-time via subscription

## Phase 5: Extra Features (AI & Notifications)

- [ ] Implement Email Notifications via N8N
  - This may require a minimal Nuxt `server/api/` proxy to trigger N8N webhooks
- [ ] Implement AI Chatbot (Claude) helper
  - Nuxt `server/api/` proxy to call Claude API with server-side secrets

---

**Current Status**: Phase 1 — Foundation (legacy cleanup ✅ done, frontend scaffolded ✅, schema not yet defined)

**Next Immediate Action**: Define the SpacetimeDB schema tables in `spacetimedb/src/schema.ts`
