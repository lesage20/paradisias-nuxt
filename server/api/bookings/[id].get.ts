import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      room: {
        include: {
          floor: true,
          type: true
        }
      },
      coupon: true,
      factures: true
    }
  })

  if (!booking) {
    throw createError({
      statusCode: 404,
      message: 'Réservation non trouvée'
    })
  }

  return booking
})
