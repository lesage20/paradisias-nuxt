<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Chambres</h1>
      <button @click="showModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Ajouter une chambre
      </button>
    </div>

    <!-- Table des chambres -->
    <div class="mt-8 flex flex-col">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <!-- Loading state -->
            <div v-if="loading" class="bg-white">
              <div v-for="i in 5" :key="i" class="border-b border-gray-200">
                <div class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-between space-x-4">
                    <Skeleton class="h-4 w-16" />
                    <Skeleton class="h-4 w-32" />
                    <Skeleton class="h-4 w-24" />
                    <Skeleton class="h-4 w-24" />
                    <Skeleton class="h-4 w-20" />
                    <Skeleton class="h-4 w-36" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <EmptyState v-else-if="!rooms.length" title="Aucune chambre"
              description="Commencez par ajouter votre première chambre.">
              <template #action>
                <button @click="showModal = true"
                  class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                  Nouvelle chambre
                </button>
              </template>
            </EmptyState>

            <!-- Table content -->
            <table v-else class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étage
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                <tr v-for="room in rooms" :key="room.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ room.number }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ room.floor.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ room.type.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="{
                      'px-2 py-1 rounded text-sm font-medium': true,
                      'bg-green-100 text-green-800': room.status === 'disponible',
                      'bg-red-100 text-red-800': room.status === 'occupée',
                      'bg-yellow-100 text-yellow-800': room.status === 'maintenance'
                    }">
                      {{ room.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button @click="editRoom(room)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                      Modifier
                    </button>
                    <button @click="deleteRoom(room.id)" class="text-red-600 hover:text-red-900">
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

    <!-- Modal pour ajouter/modifier une chambre -->
    <Modal v-model="showModal" :title="isEditing ? 'Modifier la chambre' : 'Ajouter une chambre'">
      <form @submit.prevent="saveRoom" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Numéro</label>
          <div class="mt-1">
            <input v-model="formData.number" type="text"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Étage</label>
          <div class="mt-1">
            <select v-model="formData.floor_id"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required>
              <option v-for="floor in floors" :key="floor.id" :value="floor.id">
                {{ floor.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Type de chambre</label>
          <div class="mt-1">
            <select v-model="formData.type_id"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required>
              <option v-for="type in roomTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Statut</label>
          <div class="mt-1">
            <select v-model="formData.status"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required>
              <option value="disponible">Disponible</option>
              <option value="occupée">Occupée</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button type="button" @click="showModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {{ isEditing ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CreateRoomInput, UpdateRoomInput } from '~/server/validations/room'
import { PlusIcon } from '@heroicons/vue/20/solid'
import Skeleton from '~/components/Skeleton.vue'
import EmptyState from '~/components/EmptyState.vue'

const showModal = ref(false)
const isEditing = ref(false)
const rooms = ref([])
const floors = ref([])
const roomTypes = ref([])
const formData = ref<CreateRoomInput>({
  number: '',
  status: 'disponible',
  floor_id: 0,
  type_id: 0
})
const loading = ref(true)

// Charger les données
const loadData = async () => {
  loading.value = true

  try {
    const [roomsResponse, floorsResponse, typesResponse] = await Promise.all([
      $fetch('/api/rooms'),
      $fetch('/api/floors'),
      $fetch('/api/room-types')
    ])
    
    rooms.value = roomsResponse
    floors.value = floorsResponse
    roomTypes.value = typesResponse
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

// Sauvegarder une chambre
const saveRoom = async () => {
  try {
    if (isEditing.value) {
      await $fetch(`/api/rooms/${formData.value.id}`, {
        method: 'PUT',
        body: formData.value
      })
    } else {
      await $fetch('/api/rooms', {
        method: 'POST',
        body: formData.value
      })
    }
    await loadData()
    showModal.value = false
    resetForm()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la chambre:', error)
  }
}

// Modifier une chambre
const editRoom = (room: UpdateRoomInput) => {
  isEditing.value = true
  formData.value = { ...room }
  showModal.value = true
}

// Supprimer une chambre
const deleteRoom = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
    try {
      await $fetch(`/api/rooms/${id}`, {
        method: 'DELETE'
      })
      await loadData()
    } catch (error) {
      console.error('Erreur lors de la suppression de la chambre:', error)
    }
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  isEditing.value = false
  formData.value = {
    number: '',
    status: 'disponible',
    floor_id: 0,
    type_id: 0
  }
}

onMounted(() => {
  loadData()
})
</script>
