<!-- pages/confirm.vue -->
<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()

// Handle PKCE code exchange
onMounted(async () => {
  console.log('Confirm page mounted.')

  const code = route.query.code as string

  if (code) {
    console.log('Exchanging code for session...')
    const { data, error } = await supabase.auth.verifyOtp({
      type: 'email',
      token_hash: code,
    })
    // const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code:', error.message)
      // Optionally redirect to login with error
      return
    }

    // Wait for session to propagate
    if (data.session) {
      console.log('Session established, redirecting...')
      await navigateTo('/dashboard')  // Use navigateTo instead of router.push
    }
  }
})
// Fallback watcher (for implicit flow or if already logged in)
watch(user, () => {
  if (user.value) {
    console.log('User detected via watcher, redirecting...')
    router.push('/dashboard')
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="text-center">
      <h2 class="text-xl">Verifying Login...</h2>
      <p class="text-sm text-gray-400 mt-2">
        If you are not redirected automatically, <NuxtLink to="/dashboard" class="text-blue-400 hover:underline">click
          here</NuxtLink>.
      </p>
    </div>
  </div>
</template>