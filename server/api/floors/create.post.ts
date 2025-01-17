import { createFloorSchema } from '~/server/validations/floor'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = createFloorSchema.parse(body)

    const floor = await prisma.floor.create({
      data: validatedData
    })

    return floor
  } catch (error) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 400,
        message: 'Un étage avec ce nom existe déjà'
      })
    }
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }
})
