<template>
  <div class="container mx-auto px-4 py-8">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">État des Chambres</h1>
      <p class="mt-2 text-sm text-gray-600">Vue d'ensemble des chambres réservées et disponibles</p>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Chambres Réservées -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Chambres Occupées ({{ rooms.reserved.length }})
        </h2>
        <div v-if="loading" class="space-y-4">
          <Skeleton v-for="i in 3" :key="i" class="h-24" />
        </div>
        <div v-else-if="rooms.reserved.length === 0" class="py-4">
          <EmptyState message="Aucune chambre n'est actuellement occupée" />
        </div>
        <div v-else class="space-y-4">
          <div v-for="room in rooms.reserved" :key="room.id" 
               class="border rounded-lg p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-900">
                  Chambre {{ room.number }} - {{ room.type.name }}
                </h3>
                <p class="text-sm text-gray-600">{{ room.floor.name }}</p>
              </div>
              <span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Occupée
              </span>
            </div>
            <div class="mt-2">
              <p class="text-sm text-gray-600 pt-1">
                <span class="font-medium">Client: </span> 
                {{ room.current_guest?.first_name }} {{ room.current_guest?.last_name }}
              </p>
              <p class="text-sm text-gray-600 pt-1">
                <span class="font-medium">Check-in: </span> 
                {{ formatDate(room.check_in) }}
              </p>
              <p class="text-sm text-gray-600 pt-1">
                <span class="font-medium">Check-out: </span> 
                {{ formatDate(room.check_out) }}
              </p>
              <p class="text-sm text-gray-600 pt-1">
                <span class="font-medium">Temps restant: </span>
                <span :class="getRemainingTimeColor(room.check_out)">
                  {{ formatRemainingTime(room.check_out) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chambres Disponibles -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Chambres Disponibles ({{ rooms.available.length }})
        </h2>
        <div v-if="loading" class="space-y-4">
          <Skeleton v-for="i in 3" :key="i" class="h-24" />
        </div>
        <div v-else-if="rooms.available.length === 0" class="py-4">
          <EmptyState message="Aucune chambre n'est actuellement disponible" />
        </div>
        <div v-else class="space-y-4">
          <div v-for="room in rooms.available" :key="room.id" 
               class="border rounded-lg p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-900">
                  Chambre {{ room.number }} - {{ room.type.name }}
                </h3>
                <p class="text-sm text-gray-600">{{ room.floor.name }}</p>
              </div>
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Disponible
              </span>
            </div>
            <div class="mt-2">
              <p class="text-sm text-gray-600">
                <span class="font-medium">Prix:</span> 
                {{ formatPrice(room.type.price) }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Capacité:</span> 
                {{ room.type.number_adult }} adultes, {{ room.type.number_children }} enfants
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, differenceInMilliseconds, intervalToDuration } from 'date-fns'
import { fr } from 'date-fns/locale'
import Skeleton from '~/components/Skeleton.vue'
import EmptyState from '~/components/EmptyState.vue'

const rooms = ref({
  reserved: [],
  available: []
})
const loading = ref(true)

// Charger les données des chambres
const loadRooms = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/rooms/available')
    rooms.value = response
  } catch (error) {
    console.error('Erreur lors du chargement des chambres:', error)
  } finally {
    loading.value = false
  }
}

// Formater la date
const formatDate = (date: string | Date | null) => {
  if (!date) return '-'
  return format(new Date(date), 'PPP', { locale: fr })
}

// Formater le prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Formater le temps restant
const formatRemainingTime = (checkOut: string | Date | null) => {
  if (!checkOut) return '-'
  
  const now = new Date()
  const checkOutDate = new Date(checkOut)
  
  // Si le check-out est déjà passé
  if (checkOutDate < now) {
    return 'Dépassé'
  }

  const duration = intervalToDuration({
    start: now,
    end: checkOutDate
  })

  const parts = []
  if (duration.days) parts.push(`${duration.days}j`)
  if (duration.hours) parts.push(`${duration.hours}h`)
  if (duration.minutes) parts.push(`${duration.minutes}min`)
  
  return parts.length > 0 ? parts.join(' ') : 'Moins d\'une minute'
}

// Obtenir la couleur en fonction du temps restant
const getRemainingTimeColor = (checkOut: string | Date | null) => {
  if (!checkOut) return ''
  
  const now = new Date()
  const checkOutDate = new Date(checkOut)
  const diffInHours = differenceInMilliseconds(checkOutDate, now) / (1000 * 60 * 60)
  
  if (checkOutDate < now) return 'text-red-600 font-medium'
  if (diffInHours <= 1) return 'text-red-600 font-medium'
  if (diffInHours <= 3) return 'text-orange-600 font-medium'
  if (diffInHours <= 24) return 'text-yellow-600 font-medium'
  return 'text-green-600'
}

// Charger les données au montage du composant
onMounted(() => {
  loadRooms()
})
</script>
