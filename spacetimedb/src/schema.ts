// ============================================================
// REDUCERS & LIFECYCLE — SpacetimeDB Module Logic
// ============================================================
// This file imports the schema and defines all reducers.
//
// PATTERN:
//   export const reducer_name = spacetimedb.reducer(PARAMS, (ctx, args) => { ... })
//   - Reducer name comes from the EXPORT, not a string argument
//   - Params use t.type() just like table columns
//   - Client calls use camelCase: conn.reducers.reducerName({ ... })
//   - Client calls use OBJECT syntax: { param: 'value' } NOT positional args
//
// RULES:
//   - Reducers are transactional — they do NOT return data to callers
//   - Reducers must be deterministic — no filesystem, network, timers, random
//   - Use ctx.sender for the authenticated user identity
//   - Use ctx.timestamp for current time
//   - Use ctx.db.tableName for CRUD
//   - insert() returns the ROW, not the ID
//   - Auto-inc fields require 0n as placeholder: { id: 0n, ... }
//   - Update requires spreading the existing row: { ...existing, field: newValue }
//
// REFERENCE: specs/spacetimedb-typescript.md § 4 (Reducers)
// ============================================================

// ============================================================
// SCHEMA — SpacetimeDB Table Definitions
// ============================================================
// This file defines ALL tables for the module. Reducers go in index.ts.
//
// PATTERN:
//   table(OPTIONS, COLUMNS)
//   - OPTIONS (1st arg): { name, public, indexes }
//   - COLUMNS (2nd arg): { columnName: t.type() }
//
// RULES:
//   - Indexes go in OPTIONS, NOT in COLUMNS (causes "reading 'tag'" error)
//   - Index names must be unique across the ENTIRE module
//   - Use the naming convention: {table_name}_{column_name}
//   - schema() takes exactly ONE object argument at the end
//
// REFERENCE: specs/spacetimedb-typescript.md § 2 (Table Definition)
//            specs/erd.md (full ERD + index naming table)
// ============================================================

import { schema, table, t, SenderError } from "spacetimedb/server";

// ─── Profile ────────────────────────────────────────────────
// The user's profile. Uses `Identity` (from ctx.sender) as PK.
// No auto-increment ID needed — identity IS the primary key.
//
// ERD Reference:
//   Identity identity PK  — ctx.sender
//   string   email    UK
//   string   name         — optional
//   string   timezone     — default: UTC
//   Timestamp created_at
//   Timestamp updated_at
// ─────────────────────────────────────────────────────────────
const profile = table(
  {
    name: "profile",
    public: true,
    // No indexes needed — identity is the PK (auto-indexed)
    // Email uniqueness is enforced in reducer logic
  },
  {
    identity: t.identity().primaryKey(),
    email: t.string(),
    name: t.string().optional(),
    timezone: t.string(),
    createdAt: t.timestamp(),
    updatedAt: t.timestamp(),
  },
);

// ─── Group ──────────────────────────────────────────────────
// TODO: Implement the Group table
//
// ERD Reference:
//   u64      id          PK  — auto-increment
//   string   name
//   string   description     — optional
//   string   code        UK  — invite code (uniqueness enforced in reducer)
//   Identity owner_id    FK  — Profile.identity
//   Timestamp created_at
//   Timestamp updated_at
//
// Indexes needed:
//   { name: 'group_owner_id', algorithm: 'btree', columns: ['ownerId'] }

const group = table(
  {
    name: "group",
    public: true,
    indexes: [
      { name: "group_owner_id", algorithm: "btree", columns: ["owner_id"] }, // vibe-check: I don't fully understand this line
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    name: t.string(),
    description: t.string().optional(),
    code: t.string(),
    owner_id: t.identity(),
    created_at: t.timestamp(),
    updated_at: t.timestamp(),
  },
);

//
// Example:
//   const group = table(
//     {
//       name: 'group',
//       public: true,
//       indexes: [{ name: 'group_owner_id', algorithm: 'btree', columns: ['ownerId'] }],
//     },
//     {
//       id: t.u64().primaryKey().autoInc(),
//       name: t.string(),
//       description: t.string().optional(),
//       code: t.string(),             // Unique — enforced in reducer
//       ownerId: t.identity(),        // FK → Profile.identity
//       createdAt: t.timestamp(),
//       updatedAt: t.timestamp(),
//     },
//   );
// ─────────────────────────────────────────────────────────────

// ─── GroupMember ─────────────────────────────────────────────
// TODO: Implement the GroupMember table
//
// ERD Reference:
//   u64      id          PK  — auto-increment
//   u64      group_id    FK  — Group.id
//   Identity profile_id  FK  — Profile.identity
//   string   role            — "ADMIN" | "MEMBER"
//   Timestamp joined_at
//
// Indexes needed (both single-column — multi-column indexes are BROKEN):
//   { name: 'group_member_group_id',   algorithm: 'btree', columns: ['groupId'] }
//   { name: 'group_member_profile_id', algorithm: 'btree', columns: ['profileId'] }
//
// Uniqueness of (groupId, profileId) is enforced in reducer logic.

const groupMember = table(
  {
    name: "group_member",
    public: true,
    indexes: [
      {
        name: "group_member_group_id_profile_id",
        algorithm: "hash",
        columns: ["group_id", "profile_id"],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    group_id: t.u64(),
    profile_id: t.identity(),
    role: t.enum("Role", ["ADMIN", "MEMBER"]),
    joined_at: t.timestamp(),
  },
);

// Example:
//   const groupMember = table(
//     {
//       name: 'group_member',
//       public: true,
//       indexes: [
//         { name: 'group_member_group_id',   algorithm: 'btree', columns: ['groupId'] },
//         { name: 'group_member_profile_id', algorithm: 'btree', columns: ['profileId'] },
//       ],
//     },
//     {
//       id: t.u64().primaryKey().autoInc(),
//       groupId: t.u64(),             // FK → Group.id
//       profileId: t.identity(),      // FK → Profile.identity
//       role: t.string(),             // "ADMIN" | "MEMBER"
//       joinedAt: t.timestamp(),
//     },
//   );
// ─────────────────────────────────────────────────────────────

// ─── Availability ───────────────────────────────────────────
// TODO: Implement the Availability table
//
// ERD Reference:
//   u64      id          PK  — auto-increment
//   Identity profile_id  FK  — Profile.identity
//   u64      day_of_week     — 0=Sun … 6=Sat
//   string   start_time      — "HH:mm" 24h format
//   string   end_time        — "HH:mm" 24h format
//
// Indexes needed:
//   { name: 'availability_profile_id', algorithm: 'btree', columns: ['profileId'] }

const availability = table(
  {
    name: "availability",
    public: true,
    indexes: [
      {
        name: "availability_profile_id",
        algorithm: "btree",
        columns: ["profile_id"],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    profile_id: t.identity(),
    day_of_week: t.u64(),
    start_time: t.string(),
    end_time: t.string(),
  },
);

//
// Example:
//   const availability = table(
//     {
//       name: 'availability',
//       public: true,
//       indexes: [
//         { name: 'availability_profile_id', algorithm: 'btree', columns: ['profileId'] },
//       ],
//     },
//     {
//       id: t.u64().primaryKey().autoInc(),
//       profileId: t.identity(),      // FK → Profile.identity
//       dayOfWeek: t.u64(),           // 0=Sun, 1=Mon, ..., 6=Sat
//       startTime: t.string(),        // "HH:mm"
//       endTime: t.string(),          // "HH:mm"
//     },
//   );
// ─────────────────────────────────────────────────────────────

// ─── Event ──────────────────────────────────────────────────
// TODO: Implement the Event table
//
// ERD Reference:
//   u64      id          PK  — auto-increment
//   u64      group_id    FK  — Group.id
//   string   title
//   string   description     — optional
//   Timestamp start_time
//   Timestamp end_time
//   string   location        — optional
//   Timestamp created_at
//   Timestamp updated_at
//
// Indexes needed:
//   { name: 'event_group_id', algorithm: 'btree', columns: ['groupId'] }
//

const event = table(
  {
    name: "event",
    public: true,
  },
  {
    id: t.u64().primaryKey().autoInc(),
    group_id: t.u64(),
    title: t.string(),
    description: t.string().optional(),
    start_time: t.timestamp(),
    end_time: t.timestamp(),
    location: t.string().optional(),
    created_at: t.timestamp(),
    updated_at: t.timestamp(),
  },
);

// Example:
//   const event = table(
//     {
//       name: 'event',
//       public: true,
//       indexes: [
//         { name: 'event_group_id', algorithm: 'btree', columns: ['groupId'] },
//       ],
//     },
//     {
//       id: t.u64().primaryKey().autoInc(),
//       groupId: t.u64(),             // FK → Group.id
//       title: t.string(),
//       description: t.string().optional(),
//       startTime: t.timestamp(),
//       endTime: t.timestamp(),
//       location: t.string().optional(),
//       createdAt: t.timestamp(),
//       updatedAt: t.timestamp(),
//     },
//   );
// ─────────────────────────────────────────────────────────────

// ============================================================
// SCHEMA EXPORT — Pass ALL tables as a single object
// ============================================================
// When you uncomment a table above, add it here too:
//   const spacetimedb = schema({ profile, group, groupMember, availability, event });
//
// ⚠️ schema() takes exactly ONE argument — an object of tables.
//    ❌ schema(profile, group)     — WRONG
//    ❌ schema(profile)            — WRONG
//    ✅ schema({ profile, group }) — RIGHT
// ============================================================
const spacetimedb = schema({
  profile,
  group,
  groupMember,
  availability,
  event,
});

export default spacetimedb;
