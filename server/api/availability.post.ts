import { serverSupabaseUser } from "#supabase/server";
import { db } from "../utils/db";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const userId = user?.id || (user as any)?.sub;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody(event);
  const slots = body.slots; // Array of { dayOfWeek, startTime, endTime }

  if (!Array.isArray(slots)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slots must be an array",
    });
  }

  // Transaction: Delete old -> Insert new
  await db.transaction().execute(async (trx) => {
    // 1. Get Profile ID
    const profile = await trx
      .selectFrom("profiles")
      .select("id")
      .where("user_id", "=", userId)
      .executeTakeFirst();

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: "Profile not found. Please save profile first.",
      });
    }

    // 2. Delete existing slots
    await trx
      .deleteFrom("availability")
      .where("profile_id", "=", profile.id)
      .execute();

    // 3. Insert new slots (if any)
    if (slots.length > 0) {
      await trx
        .insertInto("availability")
        .values(
          slots.map((slot: any) => ({
            id: randomUUID(),
            profile_id: profile.id,
            day_of_week: slot.dayOfWeek,
            start_time: slot.startTime,
            end_time: slot.endTime,
          })),
        )
        .execute();
    }
  });

  return { success: true };
});
