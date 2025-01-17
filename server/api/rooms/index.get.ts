import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const rooms = await prisma.room.findMany({
    include: {
      floor: true,
      type: true,
      bookings: true,
      reservations: true
    }
  })

  return rooms
})
