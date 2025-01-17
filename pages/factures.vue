<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Factures</h1>
      <button
        @click="openModal()"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Nouvelle facture
      </button>
    </div>

    <!-- Tableau des factures -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Réservation
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
          <tr v-for="facture in factures" :key="facture.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ formatMontant(facture.amount) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(facture.status)">
                {{ facture.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ facture.booking?.reference || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(facture.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="editFacture(facture)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Modifier
              </button>
              <button
                @click="deleteFacture(facture.id)"
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
          {{ isEditing ? 'Modifier la facture' : 'Nouvelle facture' }}
        </h3>
      </template>

      <form @submit.prevent="saveFacture" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Réservation</label>
          <select
            v-model="formData.booking_id"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Sélectionner une réservation</option>
            <option v-for="booking in bookings" :key="booking.id" :value="booking.id">
              {{ booking.reference }} - {{ formatDate(booking.check_in) }}
            </option>
          </select>
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
          <label class="block text-sm font-medium text-gray-700">Statut</label>
          <select
            v-model="formData.status"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="en_attente">En attente</option>
            <option value="payee">Payée</option>
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

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const factures = ref([])
const bookings = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formData = ref({
  booking_id: '',
  amount: 0,
  status: 'en_attente'
})

// Charger les factures
const loadFactures = async () => {
  try {
    const response = await $fetch('/api/factures')
    factures.value = response
  } catch (error) {
    console.error('Erreur lors du chargement des factures:', error)
  }
}

// Charger les réservations
const loadBookings = async () => {
  try {
    const response = await $fetch('/api/bookings')
    bookings.value = response
  } catch (error) {
    console.error('Erreur lors du chargement des réservations:', error)
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

// Obtenir la classe CSS pour le statut
const getStatusClass = (status) => {
  const classes = {
    en_attente: 'bg-yellow-100 text-yellow-800',
    payee: 'bg-green-100 text-green-800',
    annulee: 'bg-red-100 text-red-800'
  }
  return `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes[status] || ''}`
}

// Ouvrir le modal pour ajouter/modifier
const openModal = (facture = null) => {
  if (facture) {
    isEditing.value = true
    editingId.value = facture.id
    formData.value = {
      booking_id: facture.booking_id,
      amount: facture.amount,
      status: facture.status
    }
  } else {
    isEditing.value = false
    editingId.value = null
    formData.value = {
      booking_id: '',
      amount: 0,
      status: 'en_attente'
    }
  }
  showModal.value = true
}

// Sauvegarder une facture
const saveFacture = async () => {
  try {
    if (isEditing.value) {
      await $fetch(`/api/factures/${editingId.value}`, {
        method: 'PUT',
        body: formData.value
      })
    } else {
      await $fetch('/api/factures/create', {
        method: 'POST',
        body: formData.value
      })
    }
    
    showModal.value = false
    await loadFactures()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

// Supprimer une facture
const deleteFacture = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
    try {
      await $fetch(`/api/factures/${id}`, {
        method: 'DELETE'
      })
      await loadFactures()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

// Modifier une facture
const editFacture = (facture) => {
  openModal(facture)
}

onMounted(() => {
  loadFactures()
  loadBookings()
})
</script>
