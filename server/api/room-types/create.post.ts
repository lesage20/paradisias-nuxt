import { createRoomTypeSchema } from '~/server/validations/roomType'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = createRoomTypeSchema.parse(body)

    const roomType = await prisma.roomType.create({
      data: validatedData
    })

    return roomType
  } catch (error) {
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
