import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Récupérer les données du localStorage au démarrage
    const savedState = process.client ? JSON.parse(localStorage.getItem('auth') || '{}') : {}
    
    return {
      user: savedState.user || null,
      sessionToken: savedState.sessionToken || null,
      isAuthenticated: !!savedState.user
    }
  },

  getters: {
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role?.name,
    getSessionToken: (state) => state.sessionToken
  },

  actions: {
    setUser(userData) {
      this.user = userData
      this.isAuthenticated = true
      this.saveState()
    },

    setSessionToken(token) {
      this.sessionToken = token
      this.saveState()
    },

    logout() {
      this.user = null
      this.sessionToken = null
      this.isAuthenticated = false
      if (process.client) {
        localStorage.removeItem('auth')
      }
    },

    // Sauvegarder l'état dans le localStorage
    saveState() {
      if (process.client) {
        localStorage.setItem('auth', JSON.stringify({
          user: this.user,
          sessionToken: this.sessionToken
        }))
      }
    }
  }
})
