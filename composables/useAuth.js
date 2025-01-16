export const useAuth = () => {
  const authStore = useAuthStore()

  const register = async (userData) => {
    try {
      const { data, error } = await useFetch('/api/auth/register', {
        method: 'POST',
        body: userData
      })

      if (error.value) {
        throw error.value
      }

      return { data: data.value, error: null }
    } catch (err) {
      return {
        data: null,
        error: err.data?.message || 'Une erreur est survenue lors de l\'inscription'
      }
    }
  }

  const login = async (credentials) => {
    try {
      const { data, error } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      if (error.value) {
        throw error.value
      }

      // Stocker les informations dans le store
      authStore.setUser(data.value.user)
      authStore.setSessionToken(data.value.sessionToken)

      return { data: data.value, error: null }
    } catch (err) {
      return {
        data: null,
        error: err.data?.message || 'Une erreur est survenue lors de la connexion'
      }
    }
  }

  const logout = () => {
    authStore.logout()
  }

  return {
    register,
    login,
    logout
  }
}
