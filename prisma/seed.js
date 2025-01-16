import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Création des rôles par défaut
  const roles = [
    {
      name: 'GERANT',
      description: 'Gestionnaire de l\'hôtel'
    },
    {
      name: 'ADMIN',
      description: 'Administrateur système'
    },
    {
      name: 'RECEPTIONIST',
      description: 'Réceptionniste de l\'hôtel'
    },
    {
      name: 'MENAGERE',
      description: 'Personnel d\'entretien'
    }
  ]

  console.log('Début de la création des rôles...')

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        description: role.description
      }
    })
  }

  console.log('Rôles créés avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
