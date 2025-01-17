import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const floors = await prisma.floor.findMany({
      orderBy: {
        number: 'asc'
      }
    })
    return floors
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des étages'
    })
  }
})
