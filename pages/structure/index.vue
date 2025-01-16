<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Types de Chambre</h1>
      <button
        @click="openAddDialog"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ajouter
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
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
          <tr v-for="row in roomTypes" :key="row.id">
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
                    @click="deleteRoomType(row.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </div>
              </template>
              <template v-else>
                {{ col.format ? col.format(row[col.field]) : row[col.field] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal pour ajouter/modifier -->
    <dialog
      ref="modal"
      class="p-4 rounded-lg shadow-xl backdrop:bg-gray-500/50"
    >
      <div class="w-[500px]">
        <h2 class="text-xl font-bold mb-4 text-gray-900">
          {{ isEditing ? 'Modifier' : 'Ajouter' }} un type de chambre
        </h2>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
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
            <label for="number_adult" class="block text-sm font-medium text-gray-700"
              >Nombre d'adultes</label
            >
            <div class="mt-1">
              <input
                id="number_adult"
                v-model.number="form.number_adult"
                type="number"
                min="1"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label for="number_children" class="block text-sm font-medium text-gray-700"
              >Nombre d'enfants</label
            >
            <div class="mt-1">
              <input
                id="number_children"
                v-model.number="form.number_children"
                type="number"
                min="0"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Prix</label>
            <div class="mt-1">
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                min="0"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
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
const columns = [
  {
    name: 'id',
    required: true,
    label: '#',
    align: 'center',
    field: (row: any) => row.id,
    format: (val: number) => `${val}`,
    sortable: true,
  },
  {
    name: 'name',
    align: 'center',
    label: 'Nom',
    field: 'name',
    sortable: true,
  },
  {
    name: 'number_adult',
    label: 'Nbre Adultes',
    field: 'number_adult',
    align: 'center',
    sortable: true,
  },
  {
    name: 'number_children',
    label: 'Nbre enfants',
    field: 'number_children',
    align: 'center',
    sortable: true,
  },
  {
    name: 'price',
    label: 'Prix (FCFA)',
    field: 'price',
    sortable: true,
    align: 'center',
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Actions',
  },
]

const modal = ref<HTMLDialogElement>()
const isEditing = ref(false)
const roomTypes = ref([])
const form = ref({
  id: null as number | null,
  name: '',
  number_adult: 1,
  number_children: 0,
  price: 0,
})

// Fetch room types
const fetchRoomTypes = async () => {
  try {
    const response = await $fetch('/api/room-types')
    roomTypes.value = response
  } catch (error) {
    console.error('Erreur lors de la récupération des types de chambre:', error)
  }
}

// Open dialog for adding
const openAddDialog = () => {
  isEditing.value = false
  form.value = {
    id: null,
    name: '',
    number_adult: 1,
    number_children: 0,
    price: 0,
  }
  modal.value?.showModal()
}

// Open dialog for editing
const openEditDialog = (roomType: any) => {
  isEditing.value = true
  form.value = { ...roomType }
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
      await $fetch(`/api/room-types/${form.value.id}`, {
        method: 'PUT',
        body: form.value,
      })
    } else {
      await $fetch('/api/room-types/create', {
        method: 'POST',
        body: form.value,
      })
    }
    await fetchRoomTypes()
    closeDialog()
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error)
  }
}

// Delete room type
const deleteRoomType = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce type de chambre ?')) {
    try {
      await $fetch(`/api/room-types/${id}`, {
        method: 'DELETE',
      })
      await fetchRoomTypes()
    } catch (error) {
      console.error('Erreur lors de la suppression du type de chambre:', error)
    }
  }
}

// Initial fetch
onMounted(() => {
  fetchRoomTypes()
})
</script>
