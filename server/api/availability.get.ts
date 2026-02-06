import { serverSupabaseUser } from "#supabase/server";
import { db } from "../utils/db";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const userId = user?.id || (user as any)?.sub;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // We need the Profile ID first because Availability is linked to Profile, not directly to User (Supabase Auth)
  // 1. Get Profile ID
  const profile = await db
    .selectFrom("profiles")
    .select("id")
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!profile) {
    return { availability: [] };
  }

  // 2. Get Availability slots
  const availability = await db
    .selectFrom("availability")
    .selectAll()
    .where("profile_id", "=", profile.id)
    .orderBy("day_of_week", "asc")
    .orderBy("start_time", "asc")
    .execute();

  return { availability };
});
