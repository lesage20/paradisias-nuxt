import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const coupons = await prisma.coupon.findMany({
    include: {
      bookings: true
    }
  })

  return coupons
})
