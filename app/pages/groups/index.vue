<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()

definePageMeta({
    middleware: 'auth'
})

// State for Modals/Inputs
const showCreateModal = ref(false)
const showJoinModal = ref(false)
const newGroupName = ref('')
const joinCode = ref('')
const loading = ref(false)
const errorMsg = ref('')

// 1. Fetch Groups
const { data, refresh } = await useFetch('/api/groups')
const groups = computed(() => data.value?.groups || [])

// 2. Create Group Action
const createGroup = async () => {
    if (!newGroupName.value) return
    loading.value = true
    try {
        const res = await $fetch('/api/groups', {
            method: 'POST',
            body: { name: newGroupName.value }
        })
        showCreateModal.value = false
        newGroupName.value = ''
        refresh()
        // Optional: redirect to new group
        // router.push(`/groups/${res.group.id}`)
    } catch (e: any) {
        errorMsg.value = e.message || 'Failed to create group'
    } finally {
        loading.value = false
    }
}

// 3. Join Group Action
const joinGroup = async () => {
    if (!joinCode.value) return
    loading.value = true
    try {
        await $fetch('/api/groups/join', {
            method: 'POST',
            body: { code: joinCode.value }
        })
        showJoinModal.value = false
        joinCode.value = ''
        refresh()
    } catch (e: any) {
        errorMsg.value = e.message || 'Failed to join group'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-white p-8">
        <div class="max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1
                        class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                        Your Groups
                    </h1>
                    <p class="text-gray-400 mt-2">Manage your event lobbies and schedules</p>
                </div>

                <div class="flex gap-4">
                    <button @click="showJoinModal = true"
                        class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-500 transition-colors">
                        Join via Code
                    </button>
                    <button @click="showCreateModal = true"
                        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
                        Create Group
                    </button>
                </div>
            </div>

            <!-- Error Toast -->
            <div v-if="errorMsg"
                class="mb-4 p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 flex justify-between">
                <span>{{ errorMsg }}</span>
                <button @click="errorMsg = ''">&times;</button>
            </div>

            <!-- Group List Grid -->
            <div v-if="groups.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="group in groups" :key="group.id" :to="`/groups/${group.id}`"
                    class="group relative bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-900/10">
                    <div class="absolute top-4 right-4">
                        <span v-if="group.role === 'ADMIN'"
                            class="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Admin
                        </span>
                        <span v-else
                            class="px-2 py-1 text-xs rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            Member
                        </span>
                    </div>

                    <h3 class="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{{ group.name }}</h3>
                    <p class="text-gray-400 text-sm mb-6 line-clamp-2">Code: <span
                            class="font-mono text-blue-300 bg-blue-500/10 px-1 rounded">{{ group.code }}</span></p>

                    <div class="flex items-center justify-between text-sm text-gray-500 border-t border-gray-700 pt-4">
                        <span>View Details &rarr;</span>
                    </div>
                </NuxtLink>
            </div>

            <!-- Empty State -->
            <div v-else
                class="col-span-full text-center py-20 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                <div class="text-gray-500 mb-4">No groups found</div>
                <button @click="showCreateModal = true" class="text-blue-400 hover:underline">Create your first
                    group</button>
            </div>

            <!-- Create Modal -->
            <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
                    <h2 class="text-xl font-bold mb-4">Create New Group</h2>
                    <input v-model="newGroupName" type="text" placeholder="Group Name"
                        class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none">
                    <div class="flex justify-end gap-2">
                        <button @click="showCreateModal = false"
                            class="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                        <button @click="createGroup" :disabled="loading"
                            class="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50">Create</button>
                    </div>
                </div>
            </div>

            <!-- Join Modal -->
            <div v-if="showJoinModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
                    <h2 class="text-xl font-bold mb-4">Join Group</h2>
                    <input v-model="joinCode" type="text" placeholder="Enter Invite Code (e.g. A1B2C3)"
                        class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase">
                    <div class="flex justify-end gap-2">
                        <button @click="showJoinModal = false"
                            class="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                        <button @click="joinGroup" :disabled="loading"
                            class="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50">Join</button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
