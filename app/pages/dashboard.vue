<script setup lang="ts">
// ============================================================
// DASHBOARD — Landing page after connecting
// ============================================================
// This page shows the user's upcoming events and quick links.
//
// TODO: Wire up SpacetimeDB data
//   1. Get current user's identity:
//      - const conn = useSpacetimeDB()
//      - conn.identity gives you the current user's Identity
//
//   2. Get user's profile:
//      - const [profiles] = useTable(tables.Profile)
//      - Find current user: profiles.find(p => p.identity.toHexString() === conn.identity.toHexString())
//
//   3. Get user's groups:
//      - const [groupMembers] = useTable(tables.GroupMember)
//      - Filter: groupMembers.filter(gm => gm.profileId.toHexString() === conn.identity.toHexString())
//      - Then look up the Group rows for each groupId
//
//   4. Get upcoming events:
//      - const [events] = useTable(tables.Event)
//      - Filter by the user's group IDs and future start_time
//
// REFERENCE: specs/spacetimedb-typescript.md § 8 (useTable returns [rows, isLoading])
// ============================================================

definePageMeta({
  path: "/",
  alias: ["/dashboard"],
  middleware: "auth",
});

// TODO: Replace with SpacetimeDB composables
// import { useSpacetimeDB, useTable } from 'spacetimedb/vue'
// import { tables } from '../../module_bindings'
// const conn = useSpacetimeDB()
// const [profiles, profilesLoading] = useTable(tables.Profile)
// const myProfile = computed(() =>
//   profiles.value.find(p => p.identity.toHexString() === conn.identity?.toHexString())
// )
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <!-- TODO: Sign out = disconnect from SpacetimeDB + clear token from localStorage -->
        <!-- You can optionally clear the token and reload the page -->
        <!-- localStorage.removeItem(TOKEN_KEY); window.location.reload() -->
      </div>

      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 class="text-xl font-semibold mb-4">Welcome back!</h2>

        <!-- TODO: Replace placeholders with real SpacetimeDB data -->
        <!-- <p class="text-gray-400">Identity: {{ conn.identity?.toHexString().slice(0, 16) }}...</p> -->
        <!-- <p class="text-gray-400">Name: {{ myProfile?.name || 'Not set' }}</p> -->
        <!-- <p class="text-gray-400">Email: {{ myProfile?.email || 'Not set' }}</p> -->
        <p class="text-gray-400">Connected to SpacetimeDB</p>

        <div class="mt-4 flex gap-3">
          <NuxtLink
            to="/groups"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            My Groups
          </NuxtLink>
          <NuxtLink
            to="/profile"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Profile Settings
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
