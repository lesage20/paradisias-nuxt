import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      floor: true,
      type: true,
      bookings: true,
      reservations: true
    }
  })

  if (!room) {
    throw createError({
      statusCode: 404,
      message: 'Chambre non trouvée'
    })
  }

  return room
})
