import { createCouponSchema } from '~/server/validations/coupon'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validated = createCouponSchema.parse(body)

  const coupon = await prisma.coupon.create({
    data: validated
  })

  return coupon
})
