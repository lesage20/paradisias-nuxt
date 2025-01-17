import { PrismaClient } from '@prisma/client'
import { generateReference } from '~/utils/reference'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Génération d'une référence unique
    const reference = generateReference()
    
    const booking = await prisma.booking.create({
      data: {
        reference,
        check_in: new Date(body.check_in),
        check_out: new Date(body.check_out),
        guest_id: body.guest_id,
        room_id: body.room_id,
        coupon_id: body.coupon_id,
        total_amount: body.total_amount,
        status: body.status || 'pending',
        notes: body.notes
      },
      include: {
        guest: true,
        room: {
          include: {
            type: true,
            floor: true
          }
        },
        coupon: true
      }
    })
    
    return booking
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la création de la réservation'
    })
  }
})
