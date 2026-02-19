import { serverSupabaseUser } from "#supabase/server";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  // 1. Authenticate
  const user = await serverSupabaseUser(event);

  // Handle case where user object is a JWT payload (local dev quirk?)
  const userId = user?.sub;
  const email = user?.email;

  if (!userId || !email) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // 2. Read body data
  const body = await readBody(event);
  const { name, timezone } = body;

  // Simple validation
  if (!timezone) {
    throw createError({
      statusCode: 400,
      statusMessage: "Timezone is required",
    });
  }

  // 3. Upsert (Insert or Update) profile
  const savedProfile = await db
    .insertInto("profiles")
    .values({
      id: randomUUID(),
      user_id: userId,
      email: email,
      name: name || "",
      timezone: timezone,
      updated_at: new Date(),
    })
    .onConflict((oc) =>
      oc.column("user_id").doUpdateSet({
        name: name || "",
        timezone: timezone,
        updated_at: new Date(),
      }),
    )
    .returningAll()
    .executeTakeFirst();

  return {
    success: true,
    profile: savedProfile,
  };
});
