<script setup lang="ts">
// ============================================================
// LOGIN PAGE — SpacetimeDB Auth
// ============================================================
// SpacetimeDB uses Identity-based auth. When a client connects,
// SpacetimeDB assigns/restores an Identity and returns a token.
// The token is stored in localStorage for reconnection.
//
// HOW AUTH WORKS IN SPACETIMEDB:
//   - First connection: no token → SpacetimeDB creates a new Identity + token
//   - Returning user: token from localStorage → SpacetimeDB restores the Identity
//   - The `onConnect` callback in app.vue already handles token storage
//
// TODO: Decide on auth flow for this page
//   Option A: SpacetimeDB's built-in Identity (anonymous, token-based)
//     - No email/password needed — the connection IS the identity
//     - This page becomes a simple "Connect" button or auto-redirect
//     - Profile info (email, name) is entered on the /profile page after connecting
//
//   Option B: Custom auth on top of SpacetimeDB
//     - Implement email/password in a SpacetimeDB reducer (e.g., `register`, `login`)
//     - Store credentials in a private table
//     - The reducer validates and returns the connection identity
//
// For now, this page just provides a "Connect" button that navigates
// to the dashboard. The actual SpacetimeDB connection happens in app.vue.
//
// REFERENCE: specs/spacetimedb.md § Authentication section
//            specs/spacetimedb-typescript.md § 8 (connection setup)
// ============================================================

const router = useRouter();

const connect = () => {
  // TODO: The SpacetimeDB connection is already established in app.vue
  //       via the SpacetimeDBProvider. Once your schema has a Profile table,
  //       you might want to check/create the user's profile here.
  //
  // Example flow:
  //   1. Connection is already active (from app.vue SpacetimeDBProvider)
  //   2. Check if profile exists for this identity
  //   3. If not, redirect to /profile to create one
  //   4. If yes, redirect to /dashboard
  router.push("/dashboard");
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4"
  >
    <div
      class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
    >
      <div class="text-center">
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Time Sync
        </h1>
        <p class="text-gray-400 mt-2">Schedule events across timezones</p>
      </div>

      <!-- TODO: Replace this simple connect button with your chosen auth flow -->
      <!-- If using SpacetimeDB Identity only, this can auto-redirect once connected -->
      <!-- If using email/password, add form fields similar to the old login page -->
      <button
        @click="connect"
        class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold shadow-lg transform hover:scale-[1.02] transition-all"
      >
        Connect & Enter
      </button>

      <p class="text-center text-sm text-gray-500">
        <!-- TODO: Show connection status here -->
        <!-- Example: "Connected as: {{ identity.toHexString().slice(0, 8) }}..." -->
        Powered by SpacetimeDB
      </p>
    </div>
  </div>
</template>
