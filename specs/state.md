# Implementation Plan

Based on `specs/main.md`, this plan outlines the steps to build the Time Sync Event Scheduler.

## Phase 1: Foundation & Database

- [x] **Update Prisma Schema**
  - Add `Group`, `GroupMember`, `Availability`, `Event` models.
  - Add `timezone` field to `Profile`.
  - Run migration (`prisma migrate dev`).
  - Generate Kysely types.
- [x] **Data Access Layer**
  - Ensure `server/utils/db.ts` is correctly set up (already exists, but verify).

## Phase 2: Core Feature - User Profile & Availability

- [x] **Backend API**
  - `POST /api/profile`: Update profile (timezone).
  - `GET /api/availability`: Fetch user availability.
  - `POST /api/availability`: Update user availability slots.
- [x] **Frontend Pages**
  - `/profile`: Form to edit name, timezone, and availability slots.
  - Component: `AvailabilityEditor` (Day/Time-range picker).

## Phase 3: Core Feature - Groups/Lobbies

- [x] **Backend API**
  - `POST /api/groups`: Create a group.
  - `POST /api/groups/join`: Join via code.
  - `GET /api/groups`: List user's groups.
  - `GET /api/groups/:id`: Get group details & members. ✅ Includes membership check + camelCase response mapping.
- [x] **Frontend Pages**
  - `/dashboard`: Basic placeholder with sign-out. (will be enriched in Phase 4)
  - `/groups/[id]`: Group details view with real data. ✅ Grid layout fixed, wired to API.
  - `/groups`: List + Create + Join groups. ✅ Done.
- [x] **Shared Types**
  - `shared/types/types.ts`: App-facing types (`Group`, `GroupMember`, `Profile`, `Role`).
  - `shared/types/groups.ts`: API response types (`GroupDetailResponse`).

## Phase 4: Core Feature - Scheduling Logic

- [ ] **Frontend Logic / Algorithm**
  - Fetch availability of all group members.
  - Calculate overlapping free time slots (considering timezones).
  - Visualize "Heatmap" or "Free Slots" on a calendar.
- [ ] **Backend API**
  - `POST /api/groups/:id/events`: Create an event.
- [ ] **Frontend Component**
  - `GroupScheduler`: The main UI described in specs ("highlight possible time slots").

## Phase 5: Extra Features (AI & Notifications)

- [ ] Implement Email Notifications (N8N).
- [ ] Implement AI Chatbot (Gemini) helper.

---

**Next Immediate Action**: Begin Phase 4 — Scheduling Logic.
