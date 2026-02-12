import { serverSupabaseUser } from "#supabase/server";

import { randomUUID, randomBytes } from "crypto";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const userId = user?.id || (user as any)?.sub;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody(event);
  const { name, description } = body;

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Group name is required",
    });
  }

  // Generate a short 6-char code (e.g., A1B2C3)
  const code = randomBytes(3).toString("hex").toUpperCase();

  // Transaction: Create Group -> Add Creator as Admin
  const newGroup = await db.transaction().execute(async (trx) => {
    // 1. Get Profile ID (needed for member link)
    const profile = await trx
      .selectFrom("profiles")
      .select("id")
      .where("user_id", "=", userId)
      .executeTakeFirst();

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: "Profile not found. Please setup your profile first.",
      });
    }

    // 2. Insert Group
    const group = await trx
      .insertInto("groups")
      .values({
        id: randomUUID(),
        name: name,
        description: description || null,
        code: code,
        owner_id: profile.id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // 3. Add Member (Creator = ADMIN)
    await trx
      .insertInto("group_members")
      .values({
        id: randomUUID(),
        group_id: group.id,
        profile_id: profile.id,
        role: "ADMIN",
        joined_at: new Date(),
      })
      .execute();

    return group;
  });

  return { success: true, group: newGroup };
});
