<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Dépenses</h1>
      <button
        @click="openModal()"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Nouvelle dépense
      </button>
    </div>

    <!-- Tableau des dépenses -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="depense in depenses" :key="depense.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ depense.title }}</td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 line-clamp-2">{{ depense.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatMontant(depense.amount) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(depense.date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="editDepense(depense)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Modifier
              </button>
              <button
                @click="deleteDepense(depense.id)"
                class="text-red-600 hover:text-red-900"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal pour ajouter/modifier -->
    <Modal v-model="showModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">
          {{ isEditing ? 'Modifier la dépense' : 'Nouvelle dépense' }}
        </h3>
      </template>

      <form @submit.prevent="saveDepense" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Titre</label>
          <input
            v-model="formData.title"
            type="text"
            maxlength="50"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Montant</label>
          <input
            v-model.number="formData.amount"
            type="number"
            min="0"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Date</label>
          <input
            v-model="formData.date"
            type="date"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
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

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const depenses = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formData = ref({
  title: '',
  description: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  spent_by_id: 1 // À remplacer par l'ID de l'utilisateur connecté
})

// Charger les dépenses
const loadDepenses = async () => {
  try {
    const response = await $fetch('/api/depenses')
    depenses.value = response
  } catch (error) {
    console.error('Erreur lors du chargement des dépenses:', error)
  }
}

// Formater la date
const formatDate = (date) => {
  return format(new Date(date), 'PPP', { locale: fr })
}

// Formater le montant
const formatMontant = (montant) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant)
}

// Ouvrir le modal pour ajouter/modifier
const openModal = (depense = null) => {
  if (depense) {
    isEditing.value = true
    editingId.value = depense.id
    formData.value = {
      ...depense,
      date: new Date(depense.date).toISOString().split('T')[0]
    }
  } else {
    isEditing.value = false
    editingId.value = null
    formData.value = {
      title: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      spent_by_id: 1
    }
  }
  showModal.value = true
}

// Sauvegarder une dépense
const saveDepense = async () => {
  try {
    if (isEditing.value) {
      await $fetch(`/api/depenses/${editingId.value}`, {
        method: 'PUT',
        body: formData.value
      })
    } else {
      await $fetch('/api/depenses/create', {
        method: 'POST',
        body: formData.value
      })
    }
    
    showModal.value = false
    await loadDepenses()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

// Supprimer une dépense
const deleteDepense = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
    try {
      await $fetch(`/api/depenses/${id}`, {
        method: 'DELETE'
      })
      await loadDepenses()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

// Modifier une dépense
const editDepense = (depense) => {
  openModal(depense)
}

onMounted(() => {
  loadDepenses()
})
</script>
