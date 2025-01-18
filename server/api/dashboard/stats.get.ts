import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const period = query.period as string || 'today'
    
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - now.getDay())
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    // Statistiques des locations en cours
    const currentBookings = await prisma.booking.count({
      where: {
        status: 'confirmed',
        check_in: { 
          gte: startDate,
          lte: now 
        },
        check_out: { gte: now }
      }
    })

    // Statistiques des réservations
    const pendingReservations = await prisma.reservation.count({
      where: {
        status: 'en_attente',
        check_in: { 
          gte: startDate
        }
      }
    })

    // Revenus
    const revenueStats = await prisma.booking.groupBy({
      by: ['status'],
      where: {
        check_in: { 
          gte: startDate 
        }
      },
      _sum: {
        total_amount: true
      }
    })

    // Évolution des locations
    const bookingEvolution = await prisma.booking.groupBy({
      by: ['check_in'],
      where: {
        check_in: { 
          gte: startDate 
        }
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
                check_in: { 
                  gte: startDate,
                  lte: now 
                },
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

    // Durée moyenne des séjours et prix moyen
    const averageStats = await prisma.booking.aggregate({
      where: {
        status: 'completed',
        check_out: { 
          gte: startDate 
        }
      },
      _avg: {
        total_amount: true
      }
    })

    return {
      currentStats: {
        activeBookings: currentBookings,
        pendingReservations,
        period: period
      },
      revenue: {
        total: revenueStats.reduce((acc, stat) => acc + (stat._sum.total_amount || 0), 0),
        byStatus: revenueStats
      },
      bookingEvolution,
      roomTypeOccupancy,
      averageStats: {
        stayPrice: averageStats._avg.total_amount
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors du chargement des statistiques'
    })
  }
})
