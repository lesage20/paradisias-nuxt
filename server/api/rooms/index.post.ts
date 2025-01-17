import { createRoomSchema } from '~/server/validations/room'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validated = createRoomSchema.parse(body)

  const room = await prisma.room.create({
    data: validated,
    include: {
      floor: true,
      type: true
    }
  })

  return room
})
