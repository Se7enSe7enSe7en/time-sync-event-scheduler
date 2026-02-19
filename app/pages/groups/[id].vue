<script setup lang="ts">
const route = useRoute();
const groupId = route.params.id;

definePageMeta({
  middleware: "auth",
});

// =============================================================
// TODO STEP 1: FETCH GROUP DATA
// =============================================================
// Use `useFetch` to call your new API endpoint.
//
// const { data, pending, error } = await useFetch(`/api/groups/${groupId}`)
//
// This returns a reactive `data` object shaped like: { group: {...}, members: [...] }
//
// TIP: You can create computed properties to make the template cleaner:
//   const group = computed(() => data.value?.group)
//   const members = computed(() => data.value?.members || [])
//
// REFERENCE: Look at how groups/index.vue (line 18-19) does it — same pattern!
// Docs: https://nuxt.com/docs/api/composables/use-fetch

// vibe-check: not sure about using the "{ group: Group, members: GroupMember[] }" directly to the Generics of useFetch<T>
// vibe-check: if I were to make a new type for the response "{ group: Group, members: GroupMember[] }" how would I orginize the types for these in the types.ts
const { data, pending, error } = useFetch<{
  group: Group;
  members: GroupMember[];
}>(`/api/groups/${groupId}`);

const group = computed(() => data.value?.group);
const members = computed(() => data.value?.members);
</script>

<template>
  <div v-if="pending" class="flex items-center justify-center py-20">
    Loading...
  </div>
  <div v-else class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- ================================================= -->
      <!-- TODO STEP 2: HANDLE LOADING STATE                  -->
      <!-- ================================================= -->
      <!-- useFetch gives you a `pending` ref (boolean).      -->
      <!-- Show a loading indicator while data is being fetched. -->
      <!--                                                     -->
      <!-- Example:                                            -->
      <!-- <div v-if="pending" class="...">Loading...</div>    -->
      <!-- <div v-else> ...rest of the page... </div>          -->
      <!-- Sidebar / Info -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <!-- ========================================= -->
          <!-- TODO STEP 3: REPLACE HARDCODED GROUP INFO  -->
          <!-- ========================================= -->
          <!-- Replace "Gaming Weekend" with: group?.name -->
          <!-- Replace the ID line to show group?.code    -->
          <!-- "Created 2 days ago" → format group?.created_at -->
          <h1 class="text-2xl font-bold mb-2">{{ group?.name }}</h1>
          <p class="text-gray-400 text-sm mb-4">ID: {{ group?.code }}</p>
          <div class="flex items-center gap-2 mb-6">
            <span
              class="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
            >
              Active
            </span>
            <span class="text-xs text-gray-500">{{
              !group?.createdAt ? "???" : formatYYYYMMDD(group.createdAt)
            }}</span>
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
          <!-- ============================================ -->
          <!-- TODO STEP 4: REPLACE HARDCODED MEMBERS LIST  -->
          <!-- ============================================ -->
          <!-- "Members (5)"   → "Members ({{ members.length }})"   -->
          <!-- v-for="i in 5"  → v-for="member in members"         -->
          <!-- :key="i"        → :key="member.id"                   -->
          <!-- "User {{ i }}"  → {{ member.name || member.email }}  -->
          <!-- "UTC+8"         → {{ member.timezone }}              -->
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
                  {{ member.name || member.email }}
                </p>
                <p class="text-xs text-gray-500">{{ member.timezone }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Next Event Card -->
        <!-- NOTE: This will be wired up in Phase 4 (Scheduling). -->
        <!-- Leave this hardcoded for now — you'll fetch events later. -->
        <div
          class="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <h2 class="text-xl font-bold text-blue-100 mb-4">
            Next Event: Raid Night
          </h2>
          <div class="flex gap-8 text-sm text-blue-200/80">
            <div class="flex items-center gap-2">
              <span class="font-semibold">Sat, Feb 12</span>
              <span>20:00 - 23:00</span>
            </div>
            <div><span class="font-semibold">Duration:</span> 3h</div>
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
