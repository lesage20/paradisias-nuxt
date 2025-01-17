import { updateRoomTypeSchema } from '~/server/validations/roomType'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)
    const body = await readBody(event)
    
    const validatedData = updateRoomTypeSchema.parse({ ...body, id })

    const roomType = await prisma.room_Type.update({
      where: { id },
      data: {
        name: validatedData.name,
        number_adult: validatedData.numberAdult,
        number_children: validatedData.numberChildren,
        price: validatedData.price,
      }
    })

    return roomType
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Type de chambre non trouvé'
      })
    }
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }
})
