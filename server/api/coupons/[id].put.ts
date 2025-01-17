import { updateCouponSchema } from '~/server/validations/coupon'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)

  const validated = updateCouponSchema.parse({ ...body, id })

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      title: validated.title,
      description: validated.description,
      discount: validated.discount,
      code: validated.code
    }
  })

  return coupon
})
