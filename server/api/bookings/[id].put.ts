import { updateBookingSchema } from '~/server/validations/booking'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)

  const validated = updateBookingSchema.parse({ ...body, id })

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      reference: validated.reference,
      check_in: validated.check_in,
      check_out: validated.check_out,
      total_price: validated.total_price,
      payment: validated.payment,
      adults: validated.adults,
      children: validated.children,
      status: validated.status,
      room_id: validated.room_id,
      coupon_id: validated.coupon_id,
      guest_id: validated.guest_id,
      recorded_by_id: validated.recorded_by_id
    },
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

  return booking
})
