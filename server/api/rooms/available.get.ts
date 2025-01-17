import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Trouver les chambres réservées (en location)
    const reservedRooms = await prisma.room.findMany({
      where: {
        bookings: {
          some: {
            AND: [
              { check_in: { lte: today } },
              { check_out: { gte: today } },
              { status: 'confirmed' }
            ]
          }
        }
      },
      include: {
        type: true,
        floor: true,
        bookings: {
          where: {
            AND: [
              { check_in: { lte: today } },
              { check_out: { gte: today } },
              { status: 'confirmed' }
            ]
          },
          include: {
            guest: true
          }
        }
      }
    })

    // Trouver les chambres libres
    const availableRooms = await prisma.room.findMany({
      where: {
        AND: [
          { status: 'disponible' },
          {
            NOT: {
              bookings: {
                some: {
                  AND: [
                    { check_in: { lte: today } },
                    { check_out: { gte: today } },
                    { status: 'confirmed' }
                  ]
                }
              }
            }
          }
        ]
      },
      include: {
        type: true,
        floor: true
      }
    })

    return {
      reserved: reservedRooms.map(room => ({
        ...room,
        current_guest: room.bookings[0]?.guest || null,
        check_in: room.bookings[0]?.check_in || null,
        check_out: room.bookings[0]?.check_out || null
      })),
      available: availableRooms
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des chambres:', error)
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des chambres"
    })
  }
})
