<template>
  <div class="flex h-screen">
    <!-- Barre latérale -->
    <div :class="[
      'bg-gray-800 text-white transition-all duration-300 flex flex-col',
      isOpen ? 'w-64' : 'w-16'
    ]">
      <!-- Bouton burger -->
      <div class="flex items-center p-4 hover:bg-gray-700">
        <button @click="toggleSidebar" class="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span :class="['ml-3 font-semibold text-lg', !isOpen ? 'hidden' : '']">Paradisias Hotel</span>
      </div>
      <!-- Contenu de la barre latérale -->
      <div class="flex-1 p-4 overflow-y-auto">
        <nav>
          <ul class="space-y-4">
            <!-- Dashboard -->
            <li>
              <NuxtLink to="/" :class="[
                'flex items-center hover:text-gray-300 p-2 rounded-lg transition-colors',
                $route.path === '/' ? 'bg-gray-700 text-white' : ''
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span :class="['ml-2', !isOpen ? 'hidden' : '']">Dashboard</span>
              </NuxtLink>
            </li>

            <!-- Structure -->
            <li class="relative">
              <button 
                @click="toggleStructureMenu"
                class="w-full flex items-center justify-between hover:text-gray-300 p-2 rounded-lg transition-colors"
                :class="{ 'bg-gray-700 text-white': $route.path.startsWith('/structure') }"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span :class="['ml-2', !isOpen ? 'hidden' : '']">Structure Hôtel</span>
                </div>
                <svg
                  :class="['h-5 w-5 transform transition-transform duration-200', !isOpen ? 'hidden' : '', isStructureMenuOpen ? 'rotate-180' : '']"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                v-show="isStructureMenuOpen && isOpen"
                class="mt-2 pl-8 space-y-1"
              >
                <NuxtLink
                  to="/structure"
                  class="block text-sm hover:text-gray-300 py-2 px-3 rounded-lg transition-colors"
                  :class="{ 'text-white': $route.path === '/structure', 'text-gray-400': $route.path !== '/structure' }"
                >
                  Types de Chambres
                </NuxtLink>
                <NuxtLink
                  to="/structure/floors"
                  class="block text-sm hover:text-gray-300 py-2 px-3 rounded-lg transition-colors"
                  :class="{ 'text-white': $route.path === '/structure/floors', 'text-gray-400': $route.path !== '/structure/floors' }"
                >
                  Étages
                </NuxtLink>
                <NuxtLink
                  to="/structure/rooms"
                  class="block text-sm hover:text-gray-300 py-2 px-3 rounded-lg transition-colors"
                  :class="{ 'text-white': $route.path === '/structure/rooms', 'text-gray-400': $route.path !== '/structure/rooms' }"
                >
                  Chambres
                </NuxtLink>
                <NuxtLink
                  to="/structure/price-manager"
                  class="block text-sm hover:text-gray-300 py-2 px-3 rounded-lg transition-colors"
                  :class="{ 'text-white': $route.path === '/structure/price-manager', 'text-gray-400': $route.path !== '/structure/price-manager' }"
                >
                  Gestionnaire de Prix
                </NuxtLink>
                <NuxtLink
                  to="/structure/coupons"
                  class="block text-sm hover:text-gray-300 py-2 px-3 rounded-lg transition-colors"
                  :class="{ 'text-white': $route.path === '/structure/coupons', 'text-gray-400': $route.path !== '/structure/coupon' }"
                >
                  Coupons
                </NuxtLink>
                <NuxtLink
                  to="/structure/housekeeping"
                  class="block text-sm hover:text-gray-300 py-2 px-3 rounded-lg transition-colors"
                  :class="{ 'text-white': $route.path === '/structure/housekeeping', 'text-gray-400': $route.path !== '/structure/housekeeping' }"
                >
                  Service d'Entretien
                </NuxtLink>
              </div>
            </li>

            <!-- Locations -->
            <li>
              <NuxtLink to="/locations" :class="[
                'flex items-center hover:text-gray-300 p-2 rounded-lg transition-colors',
                $route.path.startsWith('/locations') ? 'bg-gray-700 text-white' : ''
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span :class="['ml-2', !isOpen ? 'hidden' : '']">Locations</span>
              </NuxtLink>
            </li>

            <!-- Réservations -->
            <li>
              <NuxtLink to="/reservations" :class="[
                'flex items-center hover:text-gray-300 p-2 rounded-lg transition-colors',
                $route.path.startsWith('/reservations') ? 'bg-gray-700 text-white' : ''
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span :class="['ml-2', !isOpen ? 'hidden' : '']">Réservations</span>
              </NuxtLink>
            </li>

            <!-- Chambres Réservées -->
            <li>
              <NuxtLink to="/reserved" :class="[
                'flex items-center hover:text-gray-300 p-2 rounded-lg transition-colors',
                $route.path.startsWith('/reserved') ? 'bg-gray-700 text-white' : ''
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span :class="['ml-2', !isOpen ? 'hidden' : '']">Réservées</span>
              </NuxtLink>
            </li>

            <!-- Calendrier -->
            <li>
              <NuxtLink to="/calendar" :class="[
                'flex items-center hover:text-gray-300 p-2 rounded-lg transition-colors',
                $route.path.startsWith('/calendar') ? 'bg-gray-700 text-white' : ''
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span :class="['ml-2', !isOpen ? 'hidden' : '']">Calendrier</span>
              </NuxtLink>
            </li>

            <!-- Clients -->
            <li>
              <NuxtLink to="/guests" :class="[
                'flex items-center hover:text-gray-300 p-2 rounded-lg transition-colors',
                $route.path.startsWith('/guests') ? 'bg-gray-700 text-white' : ''
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span :class="['ml-2', !isOpen ? 'hidden' : '']">Clients</span>
              </NuxtLink>
            </li>

            <!-- Administration -->
            <li>
              <NuxtLink to="/administration" :class="[
                'flex items-center hover:text-gray-300 p-2 rounded-lg transition-colors',
                $route.path.startsWith('/administration') ? 'bg-gray-700 text-white' : ''
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span :class="['ml-2', !isOpen ? 'hidden' : '']">Administration</span>
              </NuxtLink>
            </li>

            <!-- Rapports -->
            <li>
              <NuxtLink to="/reports" :class="[
                'flex items-center hover:text-gray-300 p-2 rounded-lg transition-colors',
                $route.path.startsWith('/reports') ? 'bg-gray-700 text-white' : ''
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span :class="['ml-2', !isOpen ? 'hidden' : '']">Rapports</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
      <!-- Menu utilisateur fixé en bas -->
      <div class="border-t border-gray-700">
        <div class="p-4">
          <div class="relative">
            <button @click="toggleUserMenu" class="w-full flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span :class="['ml-2 text-sm', !isOpen ? 'hidden' : '']">John Doe</span>
              </div>
              <svg :class="['h-5 w-5 transform transition-transform', !isOpen ? 'hidden' : '', isUserMenuOpen ? 'rotate-180' : '']" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- Dropdown menu -->
            <div v-if="isUserMenuOpen && isOpen" class="absolute bottom-full left-0 w-full mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div class="py-1">
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-700">Profil</a>
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-700 text-red-400 hover:text-red-300">Déconnexion</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Contenu principal -->
    <div class="flex-1 overflow-auto bg-gray-100">
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(true)
const isUserMenuOpen = ref(false)
const isStructureMenuOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const toggleStructureMenu = () => {
  isStructureMenuOpen.value = !isStructureMenuOpen.value
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Styles de navigation */
.router-link-active {
  background-color: rgb(55, 65, 81);
  border-radius: 0.5rem;
}

.router-link-exact-active {
  background-color: rgb(55, 65, 81);
  border-radius: 0.5rem;
}

/* Personnalisation de la scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
