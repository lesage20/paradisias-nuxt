<template>
  <div>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Statistiques -->
      <div v-for="stat in stats" :key="stat.name" class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">{{ stat.name }}</dt>
        <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div class="flex items-baseline text-2xl font-semibold text-indigo-600">
            {{ stat.value }}
            <span class="ml-2 text-sm font-medium text-gray-500">{{ stat.unit }}</span>
          </div>

          <div
            :class="[
              stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
              'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
            ]"
          >
            <component
              :is="stat.changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon"
              class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center"
              aria-hidden="true"
            />
            {{ stat.change }}
          </div>
        </dd>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Réservations récentes -->
      <div class="overflow-hidden rounded-lg bg-white shadow">
        <div class="p-6">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h3 class="text-base font-semibold leading-6 text-gray-900">Réservations récentes</h3>
              <p class="mt-2 text-sm text-gray-700">Liste des dernières réservations effectuées.</p>
            </div>
          </div>
          <div class="mt-6 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Client
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Chambre
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date d'arrivée
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="reservation in recentReservations" :key="reservation.id">
                      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {{ reservation.client }}
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ reservation.room }}</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ reservation.date }}</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          :class="[
                            reservation.status === 'Confirmée'
                              ? 'text-green-700 bg-green-50'
                              : 'text-yellow-700 bg-yellow-50',
                            'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                          ]"
                        >
                          {{ reservation.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tâches du jour -->
      <div class="overflow-hidden rounded-lg bg-white shadow">
        <div class="p-6">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h3 class="text-base font-semibold leading-6 text-gray-900">Tâches du jour</h3>
              <p class="mt-2 text-sm text-gray-700">Liste des tâches à effectuer aujourd'hui.</p>
            </div>
          </div>
          <div class="mt-6 space-y-4">
            <div v-for="task in todayTasks" :key="task.id" class="flex items-center gap-x-3">
              <input
                :id="task.id"
                :name="task.id"
                type="checkbox"
                :checked="task.completed"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label :for="task.id" class="block text-sm leading-6 text-gray-900">{{ task.title }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/20/solid'

definePageMeta({
  layout: 'default'
})

// Données de démonstration
const stats = [
  {
    name: 'Réservations du mois',
    value: '45',
    unit: 'réservations',
    change: '12%',
    changeType: 'increase'
  },
  { name: 'Taux d\'occupation', value: '85.5', unit: '%', change: '2.1%', changeType: 'increase' },
  { name: 'Revenu mensuel', value: '15,200', unit: '€', change: '4.3%', changeType: 'decrease' },
  { name: 'Avis clients', value: '4.8', unit: '/ 5', change: '0.3%', changeType: 'increase' }
]

const recentReservations = [
  {
    id: 1,
    client: 'Marie Dubois',
    room: 'Suite Deluxe 101',
    date: '2025-01-20',
    status: 'Confirmée'
  },
  {
    id: 2,
    client: 'Jean Martin',
    room: 'Chambre Standard 204',
    date: '2025-01-21',
    status: 'En attente'
  },
  {
    id: 3,
    client: 'Sophie Laurent',
    room: 'Suite Junior 305',
    date: '2025-01-22',
    status: 'Confirmée'
  }
]

const todayTasks = [
  { id: 1, title: 'Préparer les chambres 101, 102 et 103 pour les arrivées', completed: false },
  { id: 2, title: 'Vérifier les stocks de produits d\'accueil', completed: true },
  { id: 3, title: 'Réunion d\'équipe à 14h', completed: false },
  { id: 4, title: 'Appeler le service de maintenance pour la climatisation', completed: false }
]
</script>
