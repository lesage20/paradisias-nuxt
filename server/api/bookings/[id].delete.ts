import { prisma } from '~/server/db'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  await prisma.booking.delete({
    where: { id }
  })

  return { success: true }
})
