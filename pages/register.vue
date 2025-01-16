<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Créer un compte</h2>
      <p class="mt-2 text-sm text-gray-600">
        Déjà inscrit ?
        <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          Se connecter
        </NuxtLink>
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700">Nom complet</label>
        <div class="mt-1">
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <div class="mt-1">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center">
        <input
          id="terms"
          v-model="acceptTerms"
          type="checkbox"
          required
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-900">
          J'accepte les
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
            conditions d'utilisation
          </a>
        </label>
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Créer mon compte
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas')
    return
  }

  try {
    // TODO: Implémenter la logique d'inscription
    console.log('Inscription avec:', {
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      acceptTerms: acceptTerms.value
    })
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
  }
}
</script>
