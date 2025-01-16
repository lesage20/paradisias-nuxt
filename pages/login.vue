<script setup>
definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const rememberMe = ref(false)

const { login } = useAuth()

const handleLogin = async () => {
  try {
    error.value = ''
    isLoading.value = true

    const { data, error: loginError } = await login({
      email: email.value,
      password: password.value
    })

    if (loginError) {
      error.value = loginError
      return
    }

    // Si "Se souvenir de moi" est coché, on stocke l'email
    if (rememberMe.value) {
      localStorage.setItem('remembered_email', email.value)
    } else {
      localStorage.removeItem('remembered_email')
    }

    // Redirection vers le tableau de bord
    await navigateTo('/dashboard')
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la connexion'
    console.error('Erreur de connexion:', err)
  } finally {
    isLoading.value = false
  }
}

// Récupération de l'email mémorisé au chargement
onMounted(() => {
  const rememberedEmail = localStorage.getItem('remembered_email')
  if (rememberedEmail) {
    email.value = rememberedEmail
    rememberMe.value = true
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Connexion</h2>
      <p class="mt-2 text-sm text-gray-600">
        Pas encore de compte ?
        <NuxtLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
          Créer un compte
        </NuxtLink>
      </p>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <div class="mt-1">
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <div class="mt-1">
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Se souvenir de moi
          </label>
        </div>

        <div class="text-sm">
          <NuxtLink to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
            Mot de passe oublié ?
          </NuxtLink>
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </div>
    </form>
  </div>
</template>