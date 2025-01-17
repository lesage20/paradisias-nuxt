import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)

  try {
    await prisma.guest.delete({
      where: { id }
    })
    return { message: "Client supprimé avec succès" }
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error)
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la suppression du client"
    })
  }
})
