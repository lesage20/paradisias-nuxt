import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        guest: true,
        room: {
          include: {
            type: true,
            floor: true
          }
        },
        coupon: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    
    return bookings
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des réservations'
    })
  }
})
