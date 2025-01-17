import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const guest = await prisma.guest.create({
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        country: body.country,
        postal_code: body.postal_code
      }
    })
    return guest
  } catch (error) {
    console.error('Erreur lors de la création du client:', error)
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la création du client"
    })
  }
})
