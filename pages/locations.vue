<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Locations</h1>
      <button @click="showModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Nouvelle Location
      </button>
    </div>

    <!-- Table -->
    <div class="mt-8 flex flex-col">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <!-- Loading state -->
            <div v-if="loading" class="bg-white">
              <div v-for="i in 5" :key="i" class="border-b border-gray-200">
                <div class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-between space-x-4">
                    <Skeleton class="h-4 w-32" />
                    <Skeleton class="h-4 w-24" />
                    <Skeleton class="h-4 w-24" />
                    <Skeleton class="h-4 w-16" />
                    <Skeleton class="h-4 w-20" />
                    <Skeleton class="h-4 w-36" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <EmptyState
              v-else-if="!bookings.length"
              title="Aucune location"
              description="Commencez par créer votre première location."
            >
              <template #action>
                <button
                  @click="showModal = true"
                  class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                  Nouvelle location
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
                    Client
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chambre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
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
                <tr v-for="booking in bookings" :key="booking.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ booking.reference }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ booking.guest.last_name }} {{ booking.guest.first_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ booking.room.number }} ({{ booking.room.type.name }})
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ new Date(booking.check_in).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ new Date(booking.check_out).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ booking.total_amount }}€</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="{
                        'px-2 py-1 rounded text-sm font-medium': true,
                        'bg-yellow-100 text-yellow-800': booking.status === 'pending',
                        'bg-green-100 text-green-800': booking.status === 'confirmed',
                        'bg-red-100 text-red-800': booking.status === 'cancelled'
                      }"
                    >
                      {{ booking.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="editBooking(booking)"
                      class="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Modifier
                    </button>
                    <button
                      @click="deleteBooking(booking.id)"
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

    <!-- Modal -->
    <Modal v-model="showModal" :title="isEditing ? 'Modifier la location' : 'Nouvelle location'">
      <form @submit.prevent="saveBooking" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Client</label>
            <div class="mt-1">
              <select
                v-model="formData.guest_id"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option v-for="guest in guests" :key="guest.id" :value="guest.id">
                  {{ guest.first_name }} {{ guest.last_name }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Chambre</label>
            <div class="mt-1">
              <select
                v-model="formData.room_id"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                  {{ room.number }} ({{ room.type.name }})
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Check-in</label>
            <div class="mt-1">
              <input
                v-model="formData.check_in"
                type="date"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Check-out</label>
            <div class="mt-1">
              <input
                v-model="formData.check_out"
                type="date"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Montant total</label>
            <div class="mt-1">
              <input
                v-model="formData.total_amount"
                type="number"
                step="0.01"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Statut</label>
            <div class="mt-1">
              <select
                v-model="formData.status"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Notes</label>
          <div class="mt-1">
            <textarea
              v-model="formData.notes"
              rows="3"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {{ isEditing ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/20/solid'
import Skeleton from '~/components/Skeleton.vue'
import EmptyState from '~/components/EmptyState.vue'

const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(true)

// Données
const bookings = ref([])
const guests = ref([])
const rooms = ref([])
const availableRooms = computed(() => {
  return rooms.value.filter(room => room.status === 'disponible')
})

const formData = ref({
  guest_id: 0,
  room_id: 0,
  check_in: '',
  check_out: '',
  total_amount: 0,
  status: 'pending',
  notes: ''
})

// Charger les données
const loadData = async () => {
  loading.value = true

  try {
    const [bookingsResponse, guestsResponse, roomsResponse] = await Promise.all([
      $fetch('/api/bookings'),
      $fetch('/api/guests'),
      $fetch('/api/rooms')
    ])
    
    bookings.value = bookingsResponse
    guests.value = guestsResponse
    rooms.value = roomsResponse
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

// Sauvegarder une location
const saveBooking = async () => {
  try {
    if (isEditing.value) {
      await $fetch(`/api/bookings/${formData.value.id}`, {
        method: 'PUT',
        body: formData.value
      })
    } else {
      await $fetch('/api/bookings', {
        method: 'POST',
        body: formData.value
      })
    }
    
    await loadData()
    showModal.value = false
    resetForm()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la location:', error)
  }
}

// Modifier une location
const editBooking = (booking) => {
  isEditing.value = true
  formData.value = {
    ...booking,
    check_in: new Date(booking.check_in).toISOString().split('T')[0],
    check_out: new Date(booking.check_out).toISOString().split('T')[0]
  }
  showModal.value = true
}

// Supprimer une location
const deleteBooking = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette location ?')) {
    try {
      await $fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      })
      await loadData()
    } catch (error) {
      console.error('Erreur lors de la suppression de la location:', error)
    }
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  isEditing.value = false
  formData.value = {
    guest_id: 0,
    room_id: 0,
    check_in: '',
    check_out: '',
    total_amount: 0,
    status: 'pending',
    notes: ''
  }
}

// Charger les données au montage
onMounted(loadData)
</script>
