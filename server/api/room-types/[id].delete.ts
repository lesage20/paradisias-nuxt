import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    await prisma.room_Type.delete({
      where: { id }
    })

    return { message: 'Type de chambre supprimé avec succès' }
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Type de chambre non trouvé'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la suppression du type de chambre'
    })
  }
})
