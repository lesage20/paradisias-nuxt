<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Coupons</h1>
      <button
        @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ajouter un coupon
      </button>
    </div>

    <!-- Table des coupons -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Réduction
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="coupon in coupons" :key="coupon.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ coupon.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ coupon.code }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ coupon.discount }}%</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 rounded text-sm font-medium': true,
                  'bg-green-100 text-green-800': !coupon.used,
                  'bg-red-100 text-red-800': coupon.used
                }"
              >
                {{ coupon.used ? 'Utilisé' : 'Disponible' }}
              </span>
            </td>
            <td class="px-6 py-4">{{ coupon.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="editCoupon(coupon)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Modifier
              </button>
              <button
                @click="deleteCoupon(coupon.id)"
                class="text-red-600 hover:text-red-900"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal pour ajouter/modifier un coupon -->
    <Modal v-model="showModal" :title="isEditing ? 'Modifier le coupon' : 'Ajouter un coupon'">
      <form @submit.prevent="saveCoupon" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Titre</label>
          <div class="mt-1">
            <input
              v-model="formData.title"
              type="text"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Code</label>
          <div class="mt-1">
            <input
              v-model="formData.code"
              type="text"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Réduction (%)</label>
          <div class="mt-1">
            <input
              v-model.number="formData.discount"
              type="number"
              min="0"
              max="100"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Statut</label>
          <div class="mt-1">
            <input
              v-model="formData.used"
              type="checkbox"
              class="mr-2"
            />
            <span>Utilisé</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <div class="mt-1">
            <textarea
              v-model="formData.description"
              rows="3"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
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
import type { CreateCouponInput, UpdateCouponInput } from '~/server/validations/coupon'

const showModal = ref(false)
const isEditing = ref(false)
const coupons = ref([])
const formData = ref<CreateCouponInput>({
  title: '',
  code: '',
  discount: 0,
  description: '',
  used: false
})

// Charger les coupons
const loadCoupons = async () => {
  try {
    const response = await useFetch('/api/coupons')
    coupons.value = response.data.value
  } catch (error) {
    console.error('Erreur lors du chargement des coupons:', error)
  }
}

// Sauvegarder un coupon
const saveCoupon = async () => {
  try {
    if (isEditing.value) {
      await useFetch(`/api/coupons/${formData.value.id}`, {
        method: 'PUT',
        body: formData.value
      })
    } else {
      await useFetch('/api/coupons', {
        method: 'POST',
        body: formData.value
      })
    }
    await loadCoupons()
    showModal.value = false
    resetForm()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du coupon:', error)
  }
}

// Modifier un coupon
const editCoupon = (coupon: UpdateCouponInput) => {
  isEditing.value = true
  formData.value = { ...coupon }
  showModal.value = true
}

// Supprimer un coupon
const deleteCoupon = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce coupon ?')) {
    try {
      await useFetch(`/api/coupons/${id}`, {
        method: 'DELETE'
      })
      await loadCoupons()
    } catch (error) {
      console.error('Erreur lors de la suppression du coupon:', error)
    }
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  isEditing.value = false
  formData.value = {
    title: '',
    code: '',
    discount: 0,
    description: '',
    used: false
  }
}

onMounted(() => {
  loadCoupons()
})
</script>
