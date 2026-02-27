<script setup lang="ts">
// ============================================================
// GROUP DETAIL — View group info, members, and events
// ============================================================
// This page shows a single group's details, member list, and
// the scheduling calendar (Phase 4).
//
// DATA FLOW (SpacetimeDB):
//   READS:  useTable(tables.Group)       → find by route param ID
//           useTable(tables.GroupMember)  → filter by group_id
//           useTable(tables.Profile)     → look up member profiles
//           useTable(tables.Event)       → filter by group_id (Phase 4)
//   WRITES: conn.reducers.createEvent({ ... })  (Phase 4)
//
// TODO: Wire up SpacetimeDB data
//   1. Import composables:
//      import { useSpacetimeDB, useTable } from 'spacetimedb/vue'
//      import { tables } from '../../../module_bindings'
//
//   2. Get group:
//      const conn = useSpacetimeDB()
//      const [allGroups] = useTable(tables.Group)
//      const group = computed(() => allGroups.value.find(g => g.id === BigInt(groupId)))
//
//   3. Get members with profile info:
//      const [allMembers] = useTable(tables.GroupMember)
//      const [allProfiles] = useTable(tables.Profile)
//      const members = computed(() =>
//        allMembers.value
//          .filter(m => m.groupId === BigInt(groupId))
//          .map(m => {
//            const profile = allProfiles.value.find(
//              p => p.identity.toHexString() === m.profileId.toHexString()
//            )
//            return {
//              ...m,
//              name: profile?.name,
//              email: profile?.email,
//              timezone: profile?.timezone,
//            }
//          })
//      )
//
//   4. Format timestamps:
//      SpacetimeDB Timestamps use .microsSinceUnixEpoch (BigInt)
//      const formatDate = (ts: any) =>
//        new Date(Number(ts.microsSinceUnixEpoch / 1000n)).toLocaleDateString()
//
// REFERENCE: specs/spacetimedb-typescript.md § 6 (Timestamps on client)
//            specs/erd.md (Group, GroupMember tables)
// ============================================================

const route = useRoute();
const groupId = route.params.id;

definePageMeta({
  middleware: "auth",
});

// TODO: Replace with SpacetimeDB subscriptions (see TODO block above)
// For now, using placeholder reactive values so the page renders
const pending = ref(false);
const group = ref<{ name: string; code: string; createdAt: string } | null>({
  name: "Loading...",
  code: "------",
  createdAt: "",
});
const members = ref<
  {
    id: string;
    name?: string;
    email?: string;
    timezone?: string;
    role: string;
  }[]
>([]);
</script>

<template>
  <div v-if="pending" class="flex items-center justify-center py-20">
    Loading...
  </div>
  <div v-else class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar / Info -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h1 class="text-2xl font-bold mb-2">{{ group?.name }}</h1>
          <p class="text-gray-400 text-sm mb-4">Code: {{ group?.code }}</p>
          <div class="flex items-center gap-2 mb-6">
            <span
              class="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
            >
              Active
            </span>
            <!-- TODO: Format SpacetimeDB Timestamp -->
            <!-- new Date(Number(group.createdAt.microsSinceUnixEpoch / 1000n)).toLocaleDateString() -->
            <span class="text-xs text-gray-500">
              {{ group?.createdAt || "TODO: format timestamp" }}
            </span>
          </div>

          <div class="space-y-4">
            <button
              class="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              Schedule Event
            </button>
            <button
              class="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Invite Members
            </button>
          </div>
        </div>

        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 class="font-semibold mb-4 text-gray-200">
            Members ({{ members?.length }})
          </h3>
          <ul class="space-y-3">
            <li
              v-for="member in members"
              :key="member.id"
              class="flex items-center gap-3"
            >
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"
              ></div>
              <div>
                <p class="text-sm font-medium">
                  {{ member.name || member.email || "Unknown" }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ member.timezone || "UTC" }}
                </p>
              </div>
            </li>
          </ul>
          <!-- Empty state when no members loaded yet -->
          <p
            v-if="members.length === 0"
            class="text-sm text-gray-600 text-center py-4"
          >
            TODO: Wire up SpacetimeDB subscriptions
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Next Event Card -->
        <!-- NOTE: This will be wired up in Phase 4 (Scheduling). -->
        <div
          class="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <h2 class="text-xl font-bold text-blue-100 mb-4">Next Event: TBD</h2>
          <div class="flex gap-8 text-sm text-blue-200/80">
            <div class="flex items-center gap-2">
              <span class="font-semibold">No events scheduled yet</span>
            </div>
          </div>
        </div>

        <!-- Calendar / Scheduler Placeholder -->
        <!-- NOTE: This is Phase 4 — don't touch this yet. -->
        <div
          class="bg-gray-800 rounded-xl p-6 border border-gray-700 min-h-[500px] flex flex-col items-center justify-center text-gray-500"
        >
          <div
            class="w-16 h-16 mb-4 rounded-full bg-gray-700/50 flex items-center justify-center"
          >
            📅
          </div>
          <h3 class="text-lg font-medium text-gray-300">Schedule View</h3>
          <p class="text-sm max-w-xs text-center mt-2">
            The multi-timezone heatmap scheduler will be implemented here.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
