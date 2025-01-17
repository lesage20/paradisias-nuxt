import { updateFloorSchema } from '~/server/validations/floor'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)
    const body = await readBody(event)
    
    const validatedData = updateFloorSchema.parse({ ...body, id })

    const floor = await prisma.floor.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        number: validatedData.number,
        status: validatedData.status,
      }
    })

    return floor
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Étage non trouvé'
      })
    }
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }
})
