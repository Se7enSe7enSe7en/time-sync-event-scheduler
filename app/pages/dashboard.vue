<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()
const client = useSupabaseClient()

// Protect Route
definePageMeta({
  middleware: 'auth'
})

// Logout function
const logout = async () => {
  await client.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <button @click="logout" class="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">
          Sign Out
        </button>
      </div>

      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 class="text-xl font-semibold mb-4">Welcome back!</h2>
        <p class="text-gray-400">User ID: {{ user?.id }}</p>
        <p class="text-gray-400">Email: {{ user?.email }}</p>
      </div>
    </div>
  </div>
</template>