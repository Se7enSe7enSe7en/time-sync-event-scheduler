import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const userId = user?.sub;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // 1. Get Profile ID
  const profile = await db
    .selectFrom("profiles")
    .select("id")
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!profile) {
    return { groups: [] };
  }

  // 2. Query Groups via GroupMembers
  // Join groups table to get name and code
  const groups = await db
    .selectFrom("group_members")
    .innerJoin("groups", "groups.id", "group_members.group_id")
    .select([
      "groups.id",
      "groups.name",
      "groups.description",
      "groups.code",
      "group_members.role",
    ])
    .where("group_members.profile_id", "=", profile.id)
    .orderBy("groups.created_at", "desc")
    .execute();

  return { groups };
});
