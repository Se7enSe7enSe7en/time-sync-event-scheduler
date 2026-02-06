import { serverSupabaseUser } from "#supabase/server";
import { db } from "../utils/db";

export default defineEventHandler(async (event) => {
  // 1. Get the authenticated user from Supabase
  const user = await serverSupabaseUser(event);
  const userId = user?.id || (user as any)?.sub;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // 2. Query the Profile table
  const profile = await db
    .selectFrom("profiles")
    .selectAll()
    .where("user_id", "=", userId)
    .executeTakeFirst();

  // 3. Return the profile (or null if not found)
  return {
    profile: profile || null,
  };
});
