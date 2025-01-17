import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    await prisma.reservation.delete({
      where: { id }
    })

    return { message: 'Réservation supprimée avec succès' }
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Réservation non trouvée'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la suppression de la réservation'
    })
  }
})
