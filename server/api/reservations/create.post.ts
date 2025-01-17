import { createReservationSchema } from '~/server/validations/reservation'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = createReservationSchema.parse(body)

    // Générer une référence unique
    const reference = `RES${Date.now().toString().slice(-6)}`

    const reservation = await prisma.reservation.create({
      data: {
        reference,
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
    console.error('Erreur création réservation:', error)
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 400,
        message: 'Une réservation avec cette référence existe déjà'
      })
    }
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }
})
