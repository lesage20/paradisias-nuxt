import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Statistiques des locations en cours
    const currentBookings = await prisma.booking.count({
      where: {
        status: 'confirmed',
        check_in: { lte: now },
        check_out: { gte: now }
      }
    })

    // Statistiques des réservations
    const pendingReservations = await prisma.reservation.count({
      where: {
        status: 'en_attente',
        check_in: { gte: now }
      }
    })

    // Revenus
    const revenueStats = await prisma.booking.groupBy({
      by: ['status'],
      where: {
        check_in: { gte: startOfYear }
      },
      _sum: {
        total_amount: true
      }
    })

    // Évolution des locations par semaine
    const weeklyBookings = await prisma.booking.groupBy({
      by: ['check_in'],
      where: {
        check_in: { gte: startOfMonth }
      },
      _count: true,
      orderBy: {
        check_in: 'asc'
      }
    })

    // Taux d'occupation par type de chambre
    const roomTypeStats = await prisma.room_Type.findMany({
      include: {
        rooms: {
          include: {
            bookings: {
              where: {
                status: 'confirmed',
                check_in: { lte: now },
                check_out: { gte: now }
              }
            }
          }
        }
      }
    })

    const roomTypeOccupancy = roomTypeStats.map(type => ({
      name: type.name,
      total: type.rooms.length,
      occupied: type.rooms.reduce((acc, room) => acc + (room.bookings.length > 0 ? 1 : 0), 0)
    }))

    // Durée moyenne des séjours
    const averageStayDuration = await prisma.booking.aggregate({
      where: {
        status: 'completed',
        check_out: { gte: startOfMonth }
      },
      _avg: {
        total_amount: true
      }
    })

    return {
      currentStats: {
        activeBookings: currentBookings,
        pendingReservations,
        availableRooms: 0 // Sera calculé côté client
      },
      revenue: {
        total: revenueStats.reduce((acc, stat) => acc + (stat._sum.total_amount || 0), 0),
        byStatus: revenueStats
      },
      weeklyBookings: weeklyBookings,
      roomTypeOccupancy,
      averageStats: {
        stayPrice: averageStayDuration._avg.total_amount
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des statistiques"
    })
  }
})
