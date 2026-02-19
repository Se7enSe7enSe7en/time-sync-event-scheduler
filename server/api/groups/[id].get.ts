// GET /api/groups/:id
// Returns a single group's details + its members.
//
// REFERENCE FILES:
//   - server/api/groups.get.ts     → same auth pattern + Kysely query style
//   - server/api/groups/join.post.ts → same auth + getRouterParam pattern

import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler<Promise<GroupDetailResponse>>(
  async (event) => {
    // =============================================
    // STEP 1: AUTH (same pattern as every endpoint)
    // =============================================
    // - use `serverSupabaseUser(event)` to get the authenticated user
    // - extract userId: user?.id || (user as any)?.sub
    // - if no userId, throw 401 with createError({ statusCode: 401, statusMessage: "Unauthorized" })
    const user = await serverSupabaseUser(event);
    const userId = user?.sub; // .sub is the supabase user id
    if (userId === undefined) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    // =============================================
    // STEP 2: GET THE ROUTE PARAM
    // =============================================
    // - use `getRouterParam(event, 'id')` to read the group ID from the URL
    //   e.g. /api/groups/abc-123 → groupId = "abc-123"
    // - if no groupId, throw 400 with statusMessage: "Group ID is required"
    //
    // Docs: https://nuxt.com/docs/guide/directory-structure/server#matching-route-parameters
    const groupId = getRouterParam(event, "id");
    if (groupId === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Group ID is required",
      });
    }

    // check if user is a member of the group
    const profile = await db
      .selectFrom("profiles")
      .select("id")
      .where("user_id", "=", userId)
      .executeTakeFirst();

    if (profile === undefined) {
      throw createError({
        statusCode: 500,
        statusMessage: "No profile found",
      });
    }

    const isMember = await db
      .selectFrom("group_members")
      .select("id")
      .where("group_id", "=", groupId)
      .where("profile_id", "=", profile.id)
      .executeTakeFirst();

    if (isMember === undefined) {
      throw createError({
        statusCode: 403,
        statusMessage: "Not a member of this group",
      });
    }

    // =============================================
    // STEP 3: QUERY THE GROUP
    // =============================================
    // - db.selectFrom('groups')
    // - .selectAll()              ← grabs all columns, or pick specific ones with .select([...])
    // - .where('id', '=', groupId)
    // - .executeTakeFirst()       ← returns the first row or undefined
    // - if no group found, throw 404 with statusMessage: "Group not found"
    const group = await db
      .selectFrom("groups")
      .selectAll()
      .where("id", "=", groupId)
      .executeTakeFirst();

    if (group === undefined) {
      throw createError({
        statusCode: 404,
        statusMessage: "Group not found",
      });
    }
    // =============================================
    // STEP 4: QUERY THE MEMBERS
    // =============================================
    // Join `group_members` with `profiles` to get member info.
    //
    // - db.selectFrom('group_members')
    // - .innerJoin('profiles', 'profiles.id', 'group_members.profile_id')
    //     ↑ this joins ON profiles.id = group_members.profile_id
    // - .select([...])  ← pick the columns you want:
    //     'profiles.id'         → the profile's ID
    //     'profiles.name'       → display name
    //     'profiles.email'      → email
    //     'profiles.timezone'   → their timezone (important for scheduling!)
    //     'group_members.role'  → ADMIN or MEMBER
    //     'group_members.joined_at'
    // - .where('group_members.group_id', '=', groupId)
    // - .execute()                ← returns an array of rows
    //
    // TIP: Look at how groups.get.ts (line 24-36) does its innerJoin — same idea!
    const members = await db
      .selectFrom("group_members")
      .innerJoin("profiles", "profiles.id", "group_members.profile_id")
      .select([
        "profiles.id",
        "profiles.name",
        "profiles.email",
        "profiles.timezone",
        "group_members.role",
        "group_members.joined_at",
      ])
      .where("group_members.group_id", "=", groupId)
      .execute();

    // =============================================
    // STEP 5: RETURN THE RESULT
    // =============================================
    // - return { group, members }
    //
    // The frontend will receive this as: { group: {...}, members: [...] }
    return {
      group: {
        id: group.id,
        code: group.code,
        name: group.name,
        owner: group.owner_id,
        description: group.description ?? undefined,
        createdAt: group.created_at,
        updatedAt: group.updated_at,
      },
      members: members.map(
        (member) =>
          ({
            id: member.id,
            joined_at: member.joined_at,
            role: member.role as Role,
            email: member.email,
            name: member.name,
            timezone: member.timezone,
          }) as GroupMember, // vibe-check: how do I deal with having a shared type GroupMember and the GroupMember type generated from prisma-kysely
      ),
    };
  },
);
