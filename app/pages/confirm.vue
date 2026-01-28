<!-- pages/confirm.vue -->
<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()

// 1. Watch user state (standard way)
watch(user, () => {
    
  if (user.value) {
    console.log('User detected via watcher, redirecting...')
    router.push('/dashboard')
  }
}, { immediate: true })

// 2. Fallback: Check session on mount (sometimes watcher doesn't fire on initial hydrate if state was already set server-side or in storage)
onMounted(() => {
    console.log('Confirm page mounted.')
    // If user is already set, we redirect (handled by immediate watch above usually)
    
    // If not, we wait. The Nuxt Supabase plugin handles the #hash automatically.
    // But if it fails, the user stays here.
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
     <div class="text-center">
        <h2 class="text-xl">Verifying Login...</h2>
        <p class="text-sm text-gray-400 mt-2">
            If you are not redirected automatically, <NuxtLink to="/dashboard" class="text-blue-400 hover:underline">click here</NuxtLink>.
        </p>
     </div>
  </div>
</template>