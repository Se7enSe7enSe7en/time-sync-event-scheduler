<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const loading = ref(false)
const message = ref('')

// redirect if already logged in
watchEffect(() => {
    if (user.value) {
        router.push('/dashboard')
    }
})

const handleLogin = async () => {
    
    try {
        loading.value = true
        message.value = ''

        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
            options: {
                emailRedirectTo: window.location.origin + '/confirm'
            }
        })

        if (error) throw error
        message.value = 'Check your email for the login link'
    } catch (error: any) {
        message.value = error.message // ?: how did we know error has ".message" if type was any
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
      <h1 class="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Time Sync
      </h1>
      <p class="text-gray-400 text-center">Sign in to schedule your events</p>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input 
            v-model="email"
            type="email" 
            placeholder="you@example.com"
            required
            class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
          />
        </div>
        <button 
          :disabled="loading"
          class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Sending Magic Link...' : 'Send Magic Link' }}
        </button>
      </form>
      <div v-if="message" class="p-3 text-center text-sm rounded-lg bg-gray-700/50 border border-gray-600">
        {{ message }}
      </div>
    </div>
  </div>
</template>