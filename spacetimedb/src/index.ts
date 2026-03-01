import { SenderError, t } from "spacetimedb/server";
import spacetimedb from "./schema";

// Re-export so SpacetimeDB's bundler finds the schema from the entrypoint
export default spacetimedb;

// ─── Lifecycle Hooks ────────────────────────────────────────

export const init = spacetimedb.init((_ctx) => {
  // Called when the module is initially published
});

export const onConnect = spacetimedb.clientConnected((_ctx) => {
  // Called every time a new client connects
  //
  // TODO: You could auto-create a profile here if one doesn't exist:
  //   const existing = ctx.db.profile.identity.find(ctx.sender);
  //   if (!existing) {
  //     ctx.db.profile.insert({
  //       identity: ctx.sender,
  //       email: '',
  //       timezone: 'UTC',
  //       createdAt: ctx.timestamp,
  //       updatedAt: ctx.timestamp,
  //     });
  //   }

  const existing = _ctx.db.profile.identity.find(_ctx.sender);
  if (!existing) {
    _ctx.db.profile.insert({
      identity: _ctx.sender,
      email: "",
      name: undefined,
      timezone: "UTC",
      createdAt: _ctx.timestamp,
      updatedAt: _ctx.timestamp,
    });
  }
});

export const onDisconnect = spacetimedb.clientDisconnected((_ctx) => {
  // Called every time a client disconnects
  // You could set an "online" flag to false here if you add one
});

// ┌─────────────────────────────────────────────────────────────┐
// │  PROFILE REDUCERS (fully implemented as example)            │
// └─────────────────────────────────────────────────────────────┘

// ─── create_profile ─────────────────────────────────────────
// Creates a profile for the current user.
// Client: conn.reducers.createProfile({ email: '...', name: '...' })
// ─────────────────────────────────────────────────────────────
export const create_profile = spacetimedb.reducer(
  {
    email: t.string(),
    name: t.string(),
  },
  (ctx, { email, name }) => {
    // Check if profile already exists for this identity
    const existing = ctx.db.profile.identity.find(ctx.sender);
    if (existing) {
      throw new SenderError("Profile already exists for this identity");
    }

    ctx.db.profile.insert({
      identity: ctx.sender,
      email,
      name,
      timezone: "UTC", // Default timezone
      createdAt: ctx.timestamp,
      updatedAt: ctx.timestamp,
    });
  },
);

// ─── update_profile ─────────────────────────────────────────
// Updates the current user's profile (name, timezone).
// Client: conn.reducers.updateProfile({ name: '...', timezone: '...' })
//
// ⚠️  Update requires spreading the existing row!
//     { ...existing, field: newValue } — NOT partial update
// ─────────────────────────────────────────────────────────────
export const update_profile = spacetimedb.reducer(
  {
    name: t.string(),
    timezone: t.string(),
  },
  (ctx, { name, timezone }) => {
    const existing = ctx.db.profile.identity.find(ctx.sender);
    if (!existing) {
      throw new SenderError("Profile not found. Create one first.");
    }

    // Spread existing row, override only the fields we want to change
    ctx.db.profile.identity.update({
      ...existing,
      name,
      timezone,
      updatedAt: ctx.timestamp,
    });
  },
);

// ┌─────────────────────────────────────────────────────────────┐
// │  GROUP REDUCERS                                             │
// └─────────────────────────────────────────────────────────────┘
// TODO: Implement these reducers after uncommenting the Group and
//       GroupMember tables in schema.ts.
//
// ─── create_group ───────────────────────────────────────────
// Creates a new group and adds the creator as ADMIN member.
// Client: conn.reducers.createGroup({ name: '...' })
//
// Implementation guide:
//   1. Generate a unique invite code (e.g., 6-char alphanumeric)
//      ⚠️  Reducers must be deterministic! You can't use Math.random().
//          Instead, derive from ctx.timestamp or ctx.sender.
//          Or use a counter stored in a helper table.
//   2. Insert the Group row: ctx.db.group.insert({ id: 0n, name, ... })
//   3. Insert a GroupMember row for the creator with role: 'ADMIN'
//

export const create_group = spacetimedb.reducer(
  {
    name: t.string(),
    description: t.string().optional(),
  },
  (ctx, { name, description }) => {
    const profile = ctx.db.profile.identity.find(ctx.sender);
    if (!profile) throw new SenderError("create_group(): No profile");

    const code = ""; // vibe-check: I need help implementing a 6-char alphanumeric unique invite code

    const groupRow = ctx.db.group.insert({
      id: 0n, // vibe-check: what is this? "0n"
      name,
      description,
      code,
      owner_id: ctx.sender,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });

    // make creator of group as admin
    ctx.db.groupMember.insert({
      id: 0n,
      group_id: groupRow.id,
      profile_id: ctx.sender,
      role: { tag: "ADMIN" },
      joined_at: ctx.timestamp,
    });
  },
);

// export const create_group = spacetimedb.reducer(
//   { name: t.string() },
//   (ctx, { name }) => {
//     const profile = ctx.db.profile.identity.find(ctx.sender);
//     if (!profile) throw new SenderError('Create a profile first');
//
//     // TODO: Generate a deterministic invite code
//     const code = 'XXXXXX'; // Replace with real code generation
//
//     const groupRow = ctx.db.group.insert({
//       id: 0n,
//       name,
//       description: undefined,
//       code,
//       ownerId: ctx.sender,
//       createdAt: ctx.timestamp,
//       updatedAt: ctx.timestamp,
//     });
//
//     // Auto-add creator as ADMIN
//     ctx.db.groupMember.insert({
//       id: 0n,
//       groupId: groupRow.id,
//       profileId: ctx.sender,
//       role: 'ADMIN',
//       joinedAt: ctx.timestamp,
//     });
//   },
// );

// ─── join_group ─────────────────────────────────────────────
// Joins a group using an invite code.
// Client: conn.reducers.joinGroup({ code: 'ABC123' })
//
// Implementation guide:
//   1. Find the group by code (iterate groups or use an index)
//   2. Check the user isn't already a member (enforce uniqueness)
//   3. Insert a GroupMember row with role: 'MEMBER'
//

export const join_group = spacetimedb.reducer(
  { code: t.string() },
  (ctx, { code }) => {
    const profile = ctx.db.profile.identity.find(ctx.sender);
    if (!profile) throw new SenderError("join_group(): No profile");

    let targetGroup;

    // TODO: change spec for join code later,
    // some groups should be able to last long
    // so this means we might want the code to be longer
    // or something similar to discord where we use a link instead
    for (const group of ctx.db.group.iter()) {
      if (group.code === code) {
        targetGroup = group;
        break;
      }
    }
    if (!targetGroup)
      throw new SenderError(
        `join_group(): No group found with this code: ${code}`,
      );

    // check if user is already a member
    for (const groupMember of ctx.db.groupMember.iter()) {
    }
  },
);

// export const join_group = spacetimedb.reducer(
//   { code: t.string() },
//   (ctx, { code }) => {
//     const profile = ctx.db.profile.identity.find(ctx.sender);
//     if (!profile) throw new SenderError('Create a profile first');
//
//     // Find group by code — no index on code, so iterate
//     let targetGroup = undefined;
//     for (const g of ctx.db.group.iter()) {
//       if (g.code === code) { targetGroup = g; break; }
//     }
//     if (!targetGroup) throw new SenderError('Group not found with that code');
//
//     // Check not already a member
//     for (const m of ctx.db.groupMember.group_member_group_id.filter(targetGroup.id)) {
//       if (m.profileId.isEqual(ctx.sender)) {
//         throw new SenderError('Already a member of this group');
//       }
//     }
//
//     ctx.db.groupMember.insert({
//       id: 0n,
//       groupId: targetGroup.id,
//       profileId: ctx.sender,
//       role: 'MEMBER',
//       joinedAt: ctx.timestamp,
//     });
//   },
// );

// ─── leave_group ────────────────────────────────────────────
// TODO: Leaves a group. Delete the GroupMember row.
// Client: conn.reducers.leaveGroup({ groupId: 1n })
//
// export const leave_group = spacetimedb.reducer(
//   { groupId: t.u64() },
//   (ctx, { groupId }) => {
//     // Find the membership row and delete it
//     // Don't allow owner to leave (they must transfer ownership first)
//   },
// );

// ┌─────────────────────────────────────────────────────────────┐
// │  AVAILABILITY REDUCERS                                      │
// └─────────────────────────────────────────────────────────────┘
// TODO: Implement after uncommenting the Availability table.
//
// ─── set_availability ───────────────────────────────────────
// Replaces all availability slots for the current user.
// Strategy: delete all existing → insert new ones (bulk replace).
// Client: conn.reducers.setAvailability({
//   slots: [
//     { dayOfWeek: 1n, startTime: '09:00', endTime: '17:00' },
//     { dayOfWeek: 3n, startTime: '14:00', endTime: '20:00' },
//   ]
// })
//
// ⚠️  The slots param needs a product type (t.object) or you can
//     accept individual fields and call the reducer once per slot.
//     Alternatively, accept a JSON string and parse it.
//
// Implementation options:
//   Option A — One reducer call per slot (simpler):
//     export const add_availability = spacetimedb.reducer(
//       { dayOfWeek: t.u64(), startTime: t.string(), endTime: t.string() },
//       (ctx, { dayOfWeek, startTime, endTime }) => { ... }
//     );
//     export const clear_availability = spacetimedb.reducer((ctx) => {
//       // Delete all availability rows for ctx.sender
//     });
//
//   Option B — Bulk via JSON string (more complex):
//     export const set_availability = spacetimedb.reducer(
//       { slotsJson: t.string() },
//       (ctx, { slotsJson }) => {
//         const slots = JSON.parse(slotsJson);
//         // Delete existing, insert new
//       }
//     );

// ┌─────────────────────────────────────────────────────────────┐
// │  EVENT REDUCERS                                             │
// └─────────────────────────────────────────────────────────────┘
// TODO: Implement after uncommenting the Event table (Phase 4).
//
// ─── create_event ───────────────────────────────────────────
// Creates an event in a group.
// Client: conn.reducers.createEvent({ groupId: 1n, title: '...', ... })
//
// Implementation guide:
//   1. Verify the caller is a member of the group
//   2. Insert the Event row
//
// ─── update_event ───────────────────────────────────────────
// Updates an existing event.
// Only the group owner or ADMIN members should be able to do this.
//
// ─── delete_event ───────────────────────────────────────────
// Deletes an event by ID.
// ctx.db.event.id.delete(eventId)
