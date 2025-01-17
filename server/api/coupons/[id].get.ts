import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  const coupon = await prisma.coupon.findUnique({
    where: { id },
    include: {
      bookings: true
    }
  })

  if (!coupon) {
    throw createError({
      statusCode: 404,
      message: 'Coupon non trouvé'
    })
  }

  return coupon
})
