import { updateRoomSchema } from '~/server/validations/room'
import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)

  const validated = updateRoomSchema.parse({ ...body, id })

  const room = await prisma.room.update({
    where: { id },
    data: {
      number: validated.number,
      status: validated.status,
      floor_id: validated.floor_id,
      type_id: validated.type_id
    },
    include: {
      floor: true,
      type: true,
      bookings: true,
      reservations: true
    }
  })

  return room
})
