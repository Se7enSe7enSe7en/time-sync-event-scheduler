import { serverSupabaseUser } from "#supabase/server";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const userId = user?.sub;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody(event);
  const { code } = body;

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Group code is required",
    });
  }

  // Transaction: Verify Code -> Add Member
  const result = await db.transaction().execute(async (trx) => {
    // 1. Get Profile
    const profile = await trx
      .selectFrom("profiles")
      .select("id")
      .where("user_id", "=", userId)
      .executeTakeFirst();

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: "Profile not found",
      });
    }

    // 2. Find Group
    const group = await trx
      .selectFrom("groups")
      .select("id")
      .where("code", "=", code)
      .executeTakeFirst();

    if (!group) {
      throw createError({
        statusCode: 404,
        statusMessage: "Invalid group code",
      });
    }

    // 3. Check if already a member
    const existing = await trx
      .selectFrom("group_members")
      .select("id")
      .where("group_id", "=", group.id)
      .where("profile_id", "=", profile.id)
      .executeTakeFirst();

    if (existing) {
      // Already joined, just return success
      return { success: true, groupId: group.id, status: "already_joined" };
    }

    // 4. Add Member
    await trx
      .insertInto("group_members")
      .values({
        id: randomUUID(),
        group_id: group.id,
        profile_id: profile.id,
        role: "MEMBER",
        joined_at: new Date(),
      })
      .execute();

    return { success: true, groupId: group.id, status: "joined" };
  });

  return result;
});
