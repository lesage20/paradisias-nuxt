import { updateBookingSchema } from '~/server/validations/booking'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: "ID de réservation invalide"
    })
  }

  const body = await readBody(event)
  const validated = updateBookingSchema.parse({ ...body, id })
  
  try {
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
        recorded_by_id: validated.recorded_by_id,
        notes: validated.notes
      },
      include: {
        guest: true,
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
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error)
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la mise à jour de la réservation"
    })
  }
})
