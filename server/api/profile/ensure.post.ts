import { serverSupabaseUser } from "#supabase/server";

/**
 * POST /api/profile/ensure
 *
 * Called automatically after authentication to ensure a profile
 * exists for the current user. Creates one with defaults if not.
 *
 * No body needed — user info comes from the auth token.
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const userId = user?.sub;
  const email = user?.email;

  if (!userId || !email) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const profile = await ensureProfile(userId, email);

  return {
    profile,
  };
});
