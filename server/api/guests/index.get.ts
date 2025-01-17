import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: {
        created_at: 'desc'
      }
    })
    return guests
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error)
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des clients"
    })
  }
})
