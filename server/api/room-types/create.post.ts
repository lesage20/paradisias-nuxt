import { createRoomTypeSchema } from '~/server/validations/roomType'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = createRoomTypeSchema.parse(body)

    const roomType = await prisma.room_Type.create({
      data: {
        name: validatedData.name,
        number_adult: Number(validatedData.number_adult),
        number_children: Number(validatedData.number_children),
        price: Number(validatedData.price)
      }
    })

    return roomType
  } catch (error) {
    console.error('Erreur création type de chambre:', error)
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 400,
        message: 'Un type de chambre avec ce nom existe déjà'
      })
    }
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }
})
