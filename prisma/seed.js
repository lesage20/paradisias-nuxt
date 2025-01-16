import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const roles = [
  {
    name: 'GERANT',
    description: 'Gérant de l\'hôtel'
  },
  {
    name: 'ADMIN',
    description: 'Administrateur système'
  },
  {
    name: 'RECEPTIONIST',
    description: 'Réceptionniste'
  },
  {
    name: 'MENAGERE',
    description: 'Personnel de ménage'
  }
]

async function main() {
  console.log('Début du seed...')

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    })
  }

  console.log('Seed terminé !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
