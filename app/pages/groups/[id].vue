<script setup lang="ts">
const route = useRoute()
const groupId = route.params.id

definePageMeta({
    middleware: 'auth'
})
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-white p-8">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

            <!-- Sidebar / Info -->
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h1 class="text-2xl font-bold mb-2">Gaming Weekend</h1>
                    <p class="text-gray-400 text-sm mb-4">ID: {{ groupId }}</p>
                    <div class="flex items-center gap-2 mb-6">
                        <span
                            class="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            Active
                        </span>
                        <span class="text-xs text-gray-500">Created 2 days ago</span>
                    </div>

                    <div class="space-y-4">
                        <button
                            class="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
                            Schedule Event
                        </button>
                        <button class="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                            Invite Members
                        </button>
                    </div>
                </div>

                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 class="font-semibold mb-4 text-gray-200">Members (5)</h3>
                    <ul class="space-y-3">
                        <li v-for="i in 5" :key="i" class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"></div>
                            <div>
                                <p class="text-sm font-medium">User {{ i }}</p>
                                <p class="text-xs text-gray-500">UTC+8</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Main Content -->
            <div class="lg:col-span-3 space-y-6">
                <!-- Next Event Card -->
                <div
                    class="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                    <h2 class="text-xl font-bold text-blue-100 mb-4">Next Event: Raid Night</h2>
                    <div class="flex gap-8 text-sm text-blue-200/80">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold">Sat, Feb 12</span>
                            <span>20:00 - 23:00</span>
                        </div>
                        <div>
                            <span class="font-semibold">Duration:</span> 3h
                        </div>
                    </div>
                </div>

                <!-- Calendar / Scheduler Placeholder -->
                <div
                    class="bg-gray-800 rounded-xl p-6 border border-gray-700 min-h-[500px] flex flex-col items-center justify-center text-gray-500">
                    <div class="w-16 h-16 mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
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
