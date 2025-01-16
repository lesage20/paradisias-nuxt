export const useAuth = () => {
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

      // Stockage du token de session
      const token = data.value.sessionToken
      localStorage.setItem('session_token', token)

      return { data: data.value, error: null }
    } catch (err) {
      return {
        data: null,
        error: err.data?.message || 'Une erreur est survenue lors de la connexion'
      }
    }
  }

  return {
    register,
    login
  }
}
