<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
      <button
        @click="openModal()"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Nouvelle réservation
      </button>
    </div>

    <!-- Tableau des réservations -->
    <div class="mt-8 flex flex-col">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <!-- Loading state -->
            <div v-if="loading" class="bg-white">
              <div v-for="i in 5" :key="i" class="border-b border-gray-200">
                <div class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-between space-x-4">
                    <Skeleton class="h-4 w-12" />
                    <Skeleton class="h-4 w-32" />
                    <Skeleton class="h-4 w-40" />
                    <Skeleton class="h-4 w-24" />
                    <Skeleton class="h-4 w-36" />
                    <Skeleton class="h-4 w-36" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <EmptyState
              v-else-if="!reservations.length"
              title="Aucune réservation"
              description="Commencez par ajouter votre première réservation."
            >
              <template #action>
                <button
                  @click="openModal"
                  class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                  Nouvelle réservation
                </button>
              </template>
            </EmptyState>

            <!-- Table content -->
            <table v-else class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chambre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="reservation in reservations" :key="reservation.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ reservation.reference || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(reservation.check_in) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(reservation.check_out) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ reservation.room?.number }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(reservation.status)">
                      {{ reservation.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="editReservation(reservation)"
                      class="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Modifier
                    </button>
                    <button
                      @click="deleteReservation(reservation.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour ajouter/modifier -->
    <Modal v-model="showModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">
          {{ isEditing ? 'Modifier la réservation' : 'Nouvelle réservation' }}
        </h3>
      </template>

      <form @submit.prevent="saveReservation" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Chambre</label>
          <select
            v-model="formData.room_id"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Sélectionner une chambre</option>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.number }} ({{ room.type?.name }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Check-in</label>
          <input
            v-model="formData.check_in"
            type="datetime-local"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Check-out</label>
          <input
            v-model="formData.check_out"
            type="datetime-local"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Statut</label>
          <select
            v-model="formData.status"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showModal = false"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ isEditing ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/20/solid'
import Skeleton from '~/components/Skeleton.vue'
import EmptyState from '~/components/EmptyState.vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const reservations = ref([])
const rooms = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(true)

const formData = ref({
  room_id: '',
  check_in: '',
  check_out: '',
  status: 'en_attente',
  guest_id: 1, // À remplacer par l'ID du client sélectionné
  recorded_by_id: 1 // À remplacer par l'ID de l'utilisateur connecté
})

// Charger les réservations
const loadReservations = async () => {
  loading.value = true
  
  try {
    const response = await $fetch('/api/reservations')
    reservations.value = response
  } catch (error) {
    console.error('Erreur lors du chargement des réservations:', error)
  } finally {
    loading.value = false
  }
}

// Charger les chambres
const loadRooms = async () => {
  try {
    const response = await $fetch('/api/rooms')
    rooms.value = response
  } catch (error) {
    console.error('Erreur lors du chargement des chambres:', error)
  }
}

// Formater la date
const formatDate = (date) => {
  return format(new Date(date), 'PPP à p', { locale: fr })
}

// Obtenir la classe CSS pour le statut
const getStatusClass = (status) => {
  const classes = {
    en_attente: 'bg-yellow-100 text-yellow-800',
    confirmee: 'bg-green-100 text-green-800',
    annulee: 'bg-red-100 text-red-800'
  }
  return `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes[status] || ''}`
}

// Ouvrir le modal pour ajouter/modifier
const openModal = (reservation = null) => {
  if (reservation) {
    isEditing.value = true
    editingId.value = reservation.id
    formData.value = {
      ...reservation,
      check_in: new Date(reservation.check_in).toISOString().slice(0, 16),
      check_out: new Date(reservation.check_out).toISOString().slice(0, 16)
    }
  } else {
    isEditing.value = false
    editingId.value = null
    formData.value = {
      room_id: '',
      check_in: '',
      check_out: '',
      status: 'en_attente',
      guest_id: 1,
      recorded_by_id: 1
    }
  }
  showModal.value = true
}

// Sauvegarder une réservation
const saveReservation = async () => {
  try {
    const payload = {
      ...formData.value,
      check_in: new Date(formData.value.check_in).toISOString(),
      check_out: new Date(formData.value.check_out).toISOString()
    }

    if (isEditing.value) {
      await $fetch(`/api/reservations/${editingId.value}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/reservations/create', {
        method: 'POST',
        body: payload
      })
    }
    
    showModal.value = false
    await loadReservations()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

// Supprimer une réservation
const deleteReservation = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
    try {
      await $fetch(`/api/reservations/${id}`, {
        method: 'DELETE'
      })
      await loadReservations()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

// Modifier une réservation
const editReservation = (reservation) => {
  openModal(reservation)
}

onMounted(() => {
  loadReservations()
  loadRooms()
})
</script>
