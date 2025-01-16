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

  return {
    register
  }
}
