<template>
  <div class="container mx-auto px-4 py-8">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
      <p class="mt-2 text-sm text-gray-600">Vue d'ensemble de l'activité de l'hôtel</p>
    </div>

    <!-- Statistiques principales -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Locations actives -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Locations actives</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.currentStats.activeBookings }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Réservations en attente -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Réservations en attente</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.currentStats.pendingReservations }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenu du mois -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Revenu total</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatPrice(stats.revenue.total) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Prix moyen par séjour -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Prix moyen/séjour</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatPrice(stats.averageStats.stayPrice || 0) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- Évolution des locations -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Évolution des locations</h3>
        <div class="h-80">
          <Line
            v-if="chartData"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
      </div>

      <!-- Taux d'occupation par type de chambre -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Occupation par type de chambre</h3>
        <div class="h-80">
          <Bar
            v-if="roomTypeChartData"
            :data="roomTypeChartData"
            :options="roomTypeChartOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'
import { startOfWeek, format, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// État
const stats = ref({
  currentStats: {
    activeBookings: 0,
    pendingReservations: 0
  },
  revenue: {
    total: 0,
    byStatus: []
  },
  weeklyBookings: [],
  roomTypeOccupancy: [],
  averageStats: {
    stayPrice: 0
  }
})

// Charger les données
const loadStats = async () => {
  try {
    const response = await $fetch('/api/dashboard/stats')
    stats.value = response
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

// Configuration des graphiques
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
}

const roomTypeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value: number) => `${value}%`
      }
    }
  }
}

// Données pour le graphique d'évolution
const chartData = computed(() => {
  if (!stats.value.weeklyBookings.length) return null

  const labels = stats.value.weeklyBookings.map(booking => 
    format(new Date(booking.check_in), 'dd MMM', { locale: fr })
  )

  return {
    labels,
    datasets: [
      {
        label: 'Nombre de locations',
        data: stats.value.weeklyBookings.map(booking => booking._count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }
})

// Données pour le graphique des types de chambre
const roomTypeChartData = computed(() => {
  if (!stats.value.roomTypeOccupancy.length) return null

  return {
    labels: stats.value.roomTypeOccupancy.map(type => type.name),
    datasets: [
      {
        label: 'Taux d\'occupation',
        data: stats.value.roomTypeOccupancy.map(type => 
          (type.occupied / type.total) * 100
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  }
})

// Formater le prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price || 0)
}

// Charger les données au montage
onMounted(() => {
  loadStats()
})
</script>
