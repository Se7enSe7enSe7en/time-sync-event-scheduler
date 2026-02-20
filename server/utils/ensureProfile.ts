import { randomUUID } from "crypto";

/**
 * Ensures a profile exists for the given Supabase auth user.
 * If no profile exists, creates one with sensible defaults.
 * Returns the existing or newly created profile.
 */
export async function ensureProfile(userId: string, email: string) {
  // 1. Check if profile already exists
  const existing = await db
    .selectFrom("profiles")
    .selectAll()
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (existing) {
    return existing;
  }

  // 2. Create a new profile with defaults
  const newProfile = await db
    .insertInto("profiles")
    .values({
      id: randomUUID(),
      user_id: userId,
      email: email,
      name: "",
      timezone: "UTC",
      updated_at: new Date(),
    })
    .onConflict((oc) => oc.column("user_id").doNothing())
    .returningAll()
    .executeTakeFirst();

  // If onConflict fired (race condition), fetch the existing one
  if (!newProfile) {
    return await db
      .selectFrom("profiles")
      .selectAll()
      .where("user_id", "=", userId)
      .executeTakeFirstOrThrow();
  }

  return newProfile;
}
