import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Vérifier les rôles
  console.log('\nRôles disponibles :')
  const roles = await prisma.role.findMany()
  console.log(roles)

  // Vérifier les utilisateurs
  console.log('\nUtilisateurs enregistrés :')
  const users = await prisma.user.findMany({
    include: {
      role: true
    }
  })
  console.log(users)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
