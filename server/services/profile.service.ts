import { randomUUID } from "crypto";

// ============================================================
// PROFILE SERVICE
// ============================================================
// This service owns all business logic related to user profiles.
//
// MIGRATION GUIDE:
// You're moving logic FROM these fat handlers INTO this service:
//   - server/api/profile.get.ts      → profileService.getByUserId()
//   - server/api/profile.post.ts     → profileService.upsert()
//   - server/utils/ensureProfile.ts  → profileService.ensure()
//
// After migrating, DELETE server/utils/ensureProfile.ts
// since its logic will live here instead.
// ============================================================

export const profileService = {
  // ==========================================================
  // TODO: getByUserId(userId: string)
  // ==========================================================
  // Move the query from server/api/profile.get.ts (lines 16-20)
  //
  // HINT: It's a simple selectFrom → where → executeTakeFirst
  //
  // EXAMPLE:
  // async getByUserId(userId: string) {
  //   return await db
  //     .selectFrom("profiles")
  //     .selectAll()
  //     .where("user_id", "=", userId)
  //     .executeTakeFirst();
  // },
  // ==========================================================
  // TODO: getProfileId(userId: string)
  // ==========================================================
  // This is a helper used by MANY handlers (groups.post, groups.get,
  // groups/join.post, availability.get, availability.post).
  // They all do the exact same "get profile.id from user_id" lookup.
  //
  // HINT: Similar to getByUserId but only selects "id"
  // HINT: Return just the profile object (or undefined)
  //
  // EXAMPLE:
  // async getProfileId(userId: string) {
  //   return await db
  //     .selectFrom("profiles")
  //     .select("id")
  //     .where("user_id", "=", userId)
  //     .executeTakeFirst();
  // },
  // ==========================================================
  // TODO: getProfileIdOrThrow(userId: string)
  // ==========================================================
  // Same as getProfileId, but throws a 404 if not found.
  // Many handlers need this "get profile or fail" pattern.
  //
  // HINT: Call getProfileId, then check if result is undefined
  //
  // EXAMPLE:
  // async getProfileIdOrThrow(userId: string) {
  //   const profile = await this.getProfileId(userId);
  //   if (!profile) {
  //     throw createError({
  //       statusCode: 404,
  //       statusMessage: "Profile not found. Please setup your profile first.",
  //     });
  //   }
  //   return profile;
  // },
  // ==========================================================
  // TODO: ensure(userId: string, email: string)
  // ==========================================================
  // Move the logic from server/utils/ensureProfile.ts
  //
  // HINT: Copy the entire function body from ensureProfile.ts
  //       It already handles: check exists → insert with onConflict → fallback fetch
  //
  // EXAMPLE:
  // async ensure(userId: string, email: string) {
  //   const existing = await this.getByUserId(userId);
  //   if (existing) return existing;
  //
  //   const newProfile = await db
  //     .insertInto("profiles")
  //     .values({
  //       id: randomUUID(),
  //       user_id: userId,
  //       email: email,
  //       name: "",
  //       timezone: "UTC",
  //       updated_at: new Date(),
  //     })
  //     .onConflict((oc) => oc.column("user_id").doNothing())
  //     .returningAll()
  //     .executeTakeFirst();
  //
  //   if (!newProfile) {
  //     return await db
  //       .selectFrom("profiles")
  //       .selectAll()
  //       .where("user_id", "=", userId)
  //       .executeTakeFirstOrThrow();
  //   }
  //   return newProfile;
  // },
  // ==========================================================
  // TODO: upsert(userId: string, email: string, name: string, timezone: string)
  // ==========================================================
  // Move the transaction logic from server/api/profile.post.ts (lines 29-51)
  //
  // HINT: It's the insertInto → onConflict → doUpdateSet pattern
  // HINT: Remove the console.log("VIBE CHECK...") — that was just debugging
  //
  // EXAMPLE:
  // async upsert(userId: string, email: string, name: string, timezone: string) {
  //   return await db.transaction().execute(async (trx) => {
  //     return await trx
  //       .insertInto("profiles")
  //       .values({
  //         id: randomUUID(),
  //         user_id: userId,
  //         email: email,
  //         name: name || "",
  //         timezone: timezone,
  //         updated_at: new Date(),
  //       })
  //       .onConflict((oc) =>
  //         oc.column("user_id").doUpdateSet({
  //           name: name || "",
  //           timezone: timezone,
  //           updated_at: new Date(),
  //         })
  //       )
  //       .returningAll()
  //       .executeTakeFirst();
  //   });
  // },
};
