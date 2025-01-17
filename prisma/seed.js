import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Suppression des données existantes
  await prisma.booking.deleteMany()
  await prisma.facture.deleteMany()
  await prisma.room.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.room_Type.deleteMany()
  await prisma.floor.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()

  // Création des rôles par défaut
  const roles = [
    {
      name: 'Administrateur',
      description: 'Accès complet au système'
    },
    {
      name: 'Réceptionniste',
      description: 'Gestion des réservations et des clients'
    },
    {
      name: 'Femme de chambre',
      description: 'Gestion du nettoyage des chambres'
    },
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

  const createdRoles = []
  for (const role of roles) {
    const createdRole = await prisma.role.create({
      data: role
    })
    createdRoles.push(createdRole)
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash('lesagecode', 10)

  // Création de l'utilisateur
  const user = await prisma.user.create({
    data: {
      full_name: "Le sage",
      email: "angezanou00@gmail",
      role_id: createdRoles[4].id, // ADMIN role
      password: hashedPassword
    }
  })

  console.log('Utilisateur créé:', user.email)

  // Création des étages
  const floors = await Promise.all([
    prisma.floor.create({
      data: { name: 'Rez-de-chaussée', description: 'Étage principal avec réception', number: 0, status: 'actif' }
    }),
    prisma.floor.create({
      data: { name: '1er étage', description: 'Chambres standards', number: 1, status: 'actif' }
    }),
    prisma.floor.create({
      data: { name: '2ème étage', description: 'Chambres supérieures', number: 2, status: 'actif' }
    }),
    prisma.floor.create({
      data: { name: '3ème étage', description: 'Suites', number: 3, status: 'actif' }
    }),
    prisma.floor.create({
      data: { name: '4ème étage', description: 'Suites de luxe', number: 4, status: 'actif' }
    }),
    prisma.floor.create({
      data: { name: '5ème étage', description: 'Suites présidentielles', number: 5, status: 'actif' }
    }),
    prisma.floor.create({
      data: { name: '6ème étage', description: 'Restaurant et bar', number: 6, status: 'actif' }
    }),
    prisma.floor.create({
      data: { name: '7ème étage', description: 'Spa et bien-être', number: 7, status: 'actif' }
    }),
    prisma.floor.create({
      data: { name: '8ème étage', description: 'Salle de conférence', number: 8, status: 'actif' }
    }),
    prisma.floor.create({
      data: { name: '9ème étage', description: 'Terrasse panoramique', number: 9, status: 'actif' }
    })
  ])

  // Création des types de chambres
  const roomTypes = await Promise.all([
    prisma.room_Type.create({
      data: { name: 'Chambre Standard', number_adult: 2, number_children: 1, price: 100 }
    }),
    prisma.room_Type.create({
      data: { name: 'Chambre Supérieure', number_adult: 2, number_children: 2, price: 150 }
    }),
    prisma.room_Type.create({
      data: { name: 'Suite Junior', number_adult: 2, number_children: 2, price: 200 }
    }),
    prisma.room_Type.create({
      data: { name: 'Suite Executive', number_adult: 3, number_children: 2, price: 300 }
    }),
    prisma.room_Type.create({
      data: { name: 'Suite Familiale', number_adult: 4, number_children: 4, price: 400 }
    }),
    prisma.room_Type.create({
      data: { name: 'Suite Présidentielle', number_adult: 4, number_children: 2, price: 800 }
    }),
    prisma.room_Type.create({
      data: { name: 'Chambre Simple', number_adult: 1, number_children: 0, price: 80 }
    }),
    prisma.room_Type.create({
      data: { name: 'Chambre Vue Mer', number_adult: 2, number_children: 1, price: 180 }
    }),
    prisma.room_Type.create({
      data: { name: 'Suite Honeymoon', number_adult: 2, number_children: 0, price: 250 }
    }),
    prisma.room_Type.create({
      data: { name: 'Suite Royale', number_adult: 6, number_children: 4, price: 1000 }
    })
  ])

  // Création des chambres
  const rooms = await Promise.all([
    prisma.room.create({
      data: { number: '101', status: 'disponible', floor_id: floors[0].id, type_id: roomTypes[0].id }
    }),
    prisma.room.create({
      data: { number: '102', status: 'disponible', floor_id: floors[0].id, type_id: roomTypes[1].id }
    }),
    prisma.room.create({
      data: { number: '201', status: 'occupée', floor_id: floors[1].id, type_id: roomTypes[2].id }
    }),
    prisma.room.create({
      data: { number: '202', status: 'maintenance', floor_id: floors[1].id, type_id: roomTypes[3].id }
    }),
    prisma.room.create({
      data: { number: '301', status: 'disponible', floor_id: floors[2].id, type_id: roomTypes[4].id }
    }),
    prisma.room.create({
      data: { number: '302', status: 'disponible', floor_id: floors[2].id, type_id: roomTypes[5].id }
    }),
    prisma.room.create({
      data: { number: '401', status: 'occupée', floor_id: floors[3].id, type_id: roomTypes[6].id }
    }),
    prisma.room.create({
      data: { number: '402', status: 'disponible', floor_id: floors[3].id, type_id: roomTypes[7].id }
    }),
    prisma.room.create({
      data: { number: '501', status: 'disponible', floor_id: floors[4].id, type_id: roomTypes[8].id }
    }),
    prisma.room.create({
      data: { number: '502', status: 'maintenance', floor_id: floors[4].id, type_id: roomTypes[9].id }
    })
  ])

  // Création des coupons
  const coupons = await Promise.all([
    prisma.coupon.create({
      data: { title: 'Bienvenue', description: 'Coupon de bienvenue', discount: 10, code: 'WELCOME10', used: false }
    }),
    prisma.coupon.create({
      data: { title: 'Été 2025', description: 'Promotion estivale', discount: 15, code: 'SUMMER15', used: false }
    }),
    prisma.coupon.create({
      data: { title: 'Week-end', description: 'Réduction week-end', discount: 20, code: 'WEEKEND20', used: true }
    }),
    prisma.coupon.create({
      data: { title: 'Famille', description: 'Pack famille', discount: 25, code: 'FAMILY25', used: false }
    }),
    prisma.coupon.create({
      data: { title: 'Senior', description: 'Réduction senior', discount: 30, code: 'SENIOR30', used: false }
    }),
    prisma.coupon.create({
      data: { title: 'Groupe', description: 'Réduction groupe', discount: 35, code: 'GROUP35', used: true }
    }),
    prisma.coupon.create({
      data: { title: 'Fidélité', description: 'Programme fidélité', discount: 40, code: 'LOYAL40', used: false }
    }),
    prisma.coupon.create({
      data: { title: 'Anniversaire', description: 'Cadeau anniversaire', discount: 45, code: 'BIRTH45', used: false }
    }),
    prisma.coupon.create({
      data: { title: 'Noël', description: 'Promotion de Noël', discount: 50, code: 'XMAS50', used: true }
    }),
    prisma.coupon.create({
      data: { title: 'VIP', description: 'Client VIP', discount: 60, code: 'VIP60', used: false }
    })
  ])

  console.log('Base de données initialisée avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
