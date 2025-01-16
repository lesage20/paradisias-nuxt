import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const roomTypes = await prisma.roomType.findMany({
      orderBy: {
        id: 'asc'
      }
    })
    return roomTypes
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des types de chambre'
    })
  }
})
