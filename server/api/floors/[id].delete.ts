import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    await prisma.floor.delete({
      where: { id }
    })

    return { message: 'Étage supprimé avec succès' }
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Étage non trouvé'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la suppression de l\'étage'
    })
  }
})
