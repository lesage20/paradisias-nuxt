import { updateReservationSchema } from '~/server/validations/reservation'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)
    const body = await readBody(event)
    
    const validatedData = updateReservationSchema.parse({ ...body, id })

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        check_in: validatedData.check_in,
        check_out: validatedData.check_out,
        status: validatedData.status,
        room_id: validatedData.room_id,
        guest_id: validatedData.guest_id,
        recorded_by_id: validatedData.recorded_by_id
      },
      include: {
        room: {
          include: {
            type: true
          }
        }
      }
    })

    return reservation
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Réservation non trouvée'
      })
    }
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }
})
