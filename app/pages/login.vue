<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const loading = ref(false)
const message = ref('')
const isSignUp = ref(false)

const form = ref({
  email: '',
  password: ''
})

// redirect if already logged in
watchEffect(() => {
  if (user.value) {
    router.push('/dashboard')
  }
})

const handleAuth = async () => {
  try {
    loading.value = true
    message.value = ''

    if (isSignUp.value) {
      // Sign Up
      const { error } = await supabase.auth.signUp({
        email: form.value.email,
        password: form.value.password
      })
      if (error) throw error
      message.value = 'Account created! Check your email to confirm.'
    } else {
      // Sign In
      const { error } = await supabase.auth.signInWithPassword({
        email: form.value.email,
        password: form.value.password
      })
      if (error) throw error
      // Success will trigger the watchEffect above
    }
  } catch (error: any) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
    <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
      <div class="text-center">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Time Sync
        </h1>
        <p class="text-gray-400 mt-2">{{ isSignUp ? 'Create your account' : 'Welcome back' }}</p>
      </div>

      <form @submit.prevent="handleAuth" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input v-model="form.email" type="email" placeholder="you@example.com" required
            class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required minlength="6"
            class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500" />
        </div>

        <button :disabled="loading"
          class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In') }}
        </button>
      </form>

      <div v-if="message"
        class="p-3 text-center text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-200">
        {{ message }}
      </div>

      <div class="text-center text-sm text-gray-400">
        {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
        <button @click="isSignUp = !isSignUp" class="text-blue-400 hover:text-blue-300 font-medium ml-1">
          {{ isSignUp ? 'Sign In' : 'Sign Up' }}
        </button>
      </div>

    </div>
  </div>
</template>