/**
 * Plugin: Auto-create profile on authentication
 *
 * Watches the Supabase user state. When a user becomes authenticated
 * (sign-up or sign-in), ensures a profile row exists in the database.
 * Runs only on the client side.
 */
export default defineNuxtPlugin(() => {
  const user = useSupabaseUser();

  // Track whether we've already ensured for this session
  const hasEnsured = useState<boolean>("profile-ensured", () => false);

  watch(
    user,
    async (newUser) => {
      if (newUser && !hasEnsured.value) {
        try {
          await $fetch("/api/profile/ensure", { method: "POST" });
          hasEnsured.value = true;
        } catch (error) {
          console.error("[auto-profile] Failed to ensure profile:", error);
        }
      }

      // Reset flag on logout so next login re-triggers
      if (!newUser) {
        hasEnsured.value = false;
      }
    },
    { immediate: true },
  );
});
