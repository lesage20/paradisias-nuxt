<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Types de Chambres</h1>
      <button
        @click="openModal()"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Ajouter un type
      </button>
    </div>

    <!-- Tableau des types de chambres -->
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
                    <Skeleton class="h-4 w-16" />
                    <Skeleton class="h-4 w-16" />
                    <Skeleton class="h-4 w-24" />
                    <Skeleton class="h-4 w-36" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <EmptyState
              v-else-if="!roomTypes.length"
              title="Aucun type de chambre"
              description="Commencez par ajouter votre premier type de chambre."
            >
              <template #action>
                <button
                  @click="openModal"
                  class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                  Nouveau type
                </button>
              </template>
            </EmptyState>

            <!-- Table content -->
            <table v-else class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adultes
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enfants
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="roomType in roomTypes" :key="roomType.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ roomType.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ roomType.number_adult }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ roomType.number_children }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ roomType.price }}€</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="editRoomType(roomType)"
                      class="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Modifier
                    </button>
                    <button
                      @click="deleteRoomType(roomType.id)"
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
          {{ isEditing ? 'Modifier le type de chambre' : 'Ajouter un type de chambre' }}
        </h3>
      </template>

      <form @submit.prevent="savetype" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom</label>
          <div class="mt-1">
            <input
              v-model="formData.name"
              type="text"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre d'adultes</label>
          <div class="mt-1">
            <input
              v-model.number="formData.number_adult"
              type="number"
              min="1"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre d'enfants</label>
          <div class="mt-1">
            <input
              v-model.number="formData.number_children"
              type="number"
              min="0"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Prix</label>
          <div class="mt-1">
            <input
              v-model.number="formData.price"
              type="number"
              min="0"
              step="0.01"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
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
            {{ isEditing ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CreateRoomTypeInput } from '~/server/validations/roomType'
import { PlusIcon } from '@heroicons/vue/20/solid'
import Skeleton from '~/components/Skeleton.vue'
import EmptyState from '~/components/EmptyState.vue'

const roomTypes = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(true)

const formData = ref({
  name: '',
  number_adult: 1,
  number_children: 0,
  price: 0
})

// Charger les types de chambres
const loadRoomTypes = async () => {
  loading.value = true
  
  try {
    const response = await $fetch('/api/room-types')
    roomTypes.value = response
  } catch (error) {
    console.error('Erreur lors du chargement des types de chambres:', error)
  } finally {
    loading.value = false
  }
}

// Ouvrir le modal pour ajouter/modifier
const openModal = (roomType = null) => {
  if (roomType) {
    isEditing.value = true
    editingId.value = roomType.id
    formData.value = { ...roomType }
  } else {
    isEditing.value = false
    editingId.value = null
    formData.value = {
      name: '',
      number_adult: 1,
      number_children: 0,
      price: 0
    }
  }
  showModal.value = true
}

// Sauvegarder un type de chambre
const savetype = async () => {
  try {
    if (isEditing.value) {
      await $fetch(`/api/room-types/${editingId.value}`, {
        method: 'PUT',
        body: formData.value
      })
    } else {
      await $fetch('/api/room-types/create', {
        method: 'POST',
        body: formData.value
      })
    }
    
    showModal.value = false
    await loadRoomTypes()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

// Supprimer un type de chambre
const deleteRoomType = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce type de chambre ?')) {
    try {
      await $fetch(`/api/room-types/${id}`, {
        method: 'DELETE'
      })
      await loadRoomTypes()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

// Modifier un type de chambre
const editRoomType = (roomType) => {
  openModal(roomType)
}

onMounted(() => {
  loadRoomTypes()
})
</script>
