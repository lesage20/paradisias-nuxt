<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Étages</h1>
      <button
        @click="openAddDialog"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Ajouter
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
                    <Skeleton class="h-4 w-12" />
                    <Skeleton class="h-4 w-32" />
                    <Skeleton class="h-4 w-48" />
                    <Skeleton class="h-4 w-20" />
                    <Skeleton class="h-4 w-36" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <EmptyState
              v-else-if="!floors.length"
              title="Aucun étage"
              description="Commencez par ajouter votre premier étage."
            >
              <template #action>
                <button
                  @click="openAddDialog"
                  class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                  Nouvel étage
                </button>
              </template>
            </EmptyState>

            <!-- Table content -->
            <table v-else class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="col in columns"
                    :key="col.name"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    :class="{ 'text-center': col.align === 'center' }"
                  >
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="row in floors" :key="row.id">
                  <td
                    v-for="col in columns"
                    :key="col.name"
                    class="px-6 py-4 whitespace-nowrap"
                    :class="{ 'text-center': col.align === 'center' }"
                  >
                    <template v-if="col.name === 'actions'">
                      <div class="flex justify-center space-x-2">
                        <button
                          @click="openEditDialog(row)"
                          class="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                        <button
                          @click="deleteFloor(row.id)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>
                    </template>
                    <template v-else-if="col.name === 'status'">
                      <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="{
                          'bg-green-100 text-green-800': row.status === 'actif',
                          'bg-red-100 text-red-800': row.status === 'inactif'
                        }"
                      >
                        {{ row.status }}
                      </span>
                    </template>
                    <template v-else>
                      {{ col.format ? col.format(row[col.field]) : row[col.field] }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour ajouter/modifier -->
    <dialog
      ref="modal"
      class="p-4 rounded-lg shadow-xl backdrop:bg-gray-500/50"
    >
      <div class="w-[500px]">
        <h2 class="text-xl font-bold mb-4 text-gray-900">
          {{ isEditing ? 'Modifier' : 'Ajouter' }} un étage
        </h2>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom de l'étage</label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <div class="mt-1">
              <textarea
                id="description"
                v-model="form.description"
                required
                rows="3"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
          </div>
          <div>
            <label for="number" class="block text-sm font-medium text-gray-700">Numéro de l'étage</label>
            <div class="mt-1">
              <input
                id="number"
                v-model.number="form.number"
                type="number"
                min="1"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <div class="mt-1">
              <select
                id="status"
                v-model="form.status"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
            <p class="mt-1 text-sm text-gray-500">Désigne si l'étage est opérationnel</p>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeDialog"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ isEditing ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/20/solid'
import Skeleton from '~/components/Skeleton.vue'
import EmptyState from '~/components/EmptyState.vue'

definePageMeta({
  layout: 'default'
})

const columns = [
  {
    name: 'id',
    required: true,
    label: '#',
    align: 'center',
    field: "id",
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Nom',
    field: 'name',
    sortable: true,
  },
  {
    name: 'description',
    align: 'left',
    label: 'Description',
    field: 'description',
    sortable: true,
  },
  {
    name: 'number',
    label: 'Numéro',
    field: 'number',
    align: 'center',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Actions',
  },
]

const modal = ref<HTMLDialogElement>()
const isEditing = ref(false)
const floors = ref([])
const form = ref({
  id: null as number | null,
  name: '',
  description: '',
  number: 1,
  status: 'inactif',
})
const loading = ref(true)

// Fetch floors
const loadFloors = async () => {
  loading.value = true
  
  try {
    const response = await $fetch('/api/floors')
    floors.value = response
  } catch (error) {
    console.error('Erreur lors du chargement des étages:', error)
  } finally {
    loading.value = false
  }
}

// Open dialog for adding
const openAddDialog = () => {
  isEditing.value = false
  form.value = {
    id: null,
    name: '',
    description: '',
    number: 1,
    status: 'inactif',
  }
  modal.value?.showModal()
}

// Open dialog for editing
const openEditDialog = (floor: any) => {
  isEditing.value = true
  form.value = { ...floor }
  modal.value?.showModal()
}

// Close dialog
const closeDialog = () => {
  modal.value?.close()
}

// Submit form
const submitForm = async () => {
  try {
    if (isEditing.value) {
      await $fetch(`/api/floors/${form.value.id}`, {
        method: 'PUT',
        body: form.value,
      })
    } else {
      await $fetch('/api/floors/create', {
        method: 'POST',
        body: form.value,
      })
    }
    await loadFloors()
    closeDialog()
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error)
  }
}

// Delete floor
const deleteFloor = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet étage ?')) {
    try {
      await $fetch(`/api/floors/${id}`, {
        method: 'DELETE',
      })
      await loadFloors()
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étage:', error)
    }
  }
}

// Initial fetch
onMounted(() => {
  loadFloors()
})
</script>
