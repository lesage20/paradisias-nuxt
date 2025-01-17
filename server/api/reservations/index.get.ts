import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        room: {
          include: {
            type: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    return reservations
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des réservations'
    })
  }
})
