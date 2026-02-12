export default defineEventHandler(async () => {
  // create a dummy user
  try {
    await db
      .insertInto("Profile")
      .values({
        id: crypto.randomUUID(),
        userId: `test-user${Date.now()}`, // fake auth id for now
        email: `test-user${Date.now()}@example.com`,
        name: "Test Navigator",
        updatedAt: new Date(),
      })
      .execute();
  } catch (error) {
    console.error("Insert failed: ", error);
  }

  // query all profiles
  const profiles = await db.selectFrom("Profile").selectAll().execute();

  return {
    success: true,
    count: profiles.length,
    profiles,
  };
});
