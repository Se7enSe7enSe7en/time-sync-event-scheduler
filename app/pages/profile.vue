<script setup lang="ts">
const user = useSupabaseUser()
const toast = ref('') // Simple status message

definePageMeta({
    middleware: 'auth'
})

interface AvailabilitySlot {
    dayOfWeek: number
    startTime: string
    endTime: string
}

const form = ref({
    name: '',
    timezone: 'UTC',
    availability: [] as AvailabilitySlot[]
})

// 1. Fetch existing profile data AND availability
const { data: profileData, refresh: refreshProfile } = await useFetch<{ profile: any }>('/api/profile')
const { data: availabilityData, refresh: refreshAvailability } = await useFetch<{ availability: any[] }>('/api/availability')

// 2. Populate form
watchEffect(() => {
    if (profileData.value?.profile) {
        form.value.name = profileData.value.profile.name || ''
        form.value.timezone = profileData.value.profile.timezone || 'UTC'
    }
    if (availabilityData.value?.availability) {
        form.value.availability = availabilityData.value.availability.map((a: any) => ({
            dayOfWeek: a.day_of_week,
            startTime: a.start_time,
            endTime: a.end_time
        }))
    }
})

// Helper: Day names
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const addSlot = () => {
    form.value.availability.push({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' })
}

const removeSlot = (index: number) => {
    form.value.availability.splice(index, 1)
}

// 3. Save function
const saveProfile = async () => {
    try {
        // Save Profile
        await $fetch('/api/profile', {
            method: 'POST',
            body: {
                name: form.value.name,
                timezone: form.value.timezone
            }
        })

        // Save Availability
        await $fetch('/api/availability', {
            method: 'POST',
            body: {
                slots: form.value.availability
            }
        })

        toast.value = 'Settings saved successfully!'
        refreshProfile()
        refreshAvailability()
        setTimeout(() => toast.value = '', 3000)
    } catch (e) {
        toast.value = 'Error saving settings.'
        console.error(e)
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-white p-8">
        <div class="max-w-2xl mx-auto">
            <h1 class="text-3xl font-bold mb-8">Profile Settings</h1>

            <!-- Toast Notification -->
            <div v-if="toast" class="mb-4 p-4 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/50">
                {{ toast }}
            </div>

            <div class="space-y-6">
                <!-- Basic Info -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 class="text-xl font-semibold mb-6">Personal Information</h2>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Email</label>
                            <input type="text" :value="user?.email" disabled
                                class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed">
                        </div>

                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Display Name</label>
                            <input v-model="form.name" type="text" placeholder="Enter your name"
                                class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                        </div>

                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Timezone</label>
                            <select v-model="form.timezone"
                                class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:border-blue-500 outline-none">
                                <option value="UTC">UTC</option>
                                <option value="Asia/Manila">Asia/Manila (UTC+8)</option>
                                <option value="America/New_York">New York (UTC-5)</option>
                                <option value="Europe/London">London (UTC+0)</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-2">All event times will be shown relative to this
                                timezone.</p>
                        </div>
                    </div>
                </div>

                <!-- Availability Settings -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">Weekly Availability</h2>
                        <button @click="addSlot" class="text-sm text-blue-400 hover:text-blue-300 font-medium">+ Add
                            Slot</button>
                    </div>

                    <div class="space-y-3">
                        <div v-for="(slot, index) in form.availability" :key="index"
                            class="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">

                            <select v-model="slot.dayOfWeek"
                                class="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm bg-none">
                                <option v-for="(day, i) in days" :key="i" :value="i">{{ day.substring(0, 3) }}</option>
                            </select>

                            <div class="flex items-center gap-2">
                                <input v-model="slot.startTime" type="time"
                                    class="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm">
                                <span class="text-gray-500">-</span>
                                <input v-model="slot.endTime" type="time"
                                    class="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm">
                            </div>

                            <button @click="removeSlot(index)" class="ml-auto text-red-400 hover:text-red-300">
                                &times;
                            </button>
                        </div>
                        <div v-if="form.availability.length === 0" class="text-center text-gray-500 text-sm py-4">
                            No availability slots added.
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button @click="saveProfile"
                        class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
