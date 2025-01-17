import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Suppression des données existantes dans l'ordre inverse des relations
  await prisma.facture.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.guest.deleteMany()
  await prisma.room.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.room_Type.deleteMany()
  await prisma.floor.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()

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

  const createdRoles = []
  for (const role of roles) {
    const createdRole = await prisma.role.create({
      data: role
    })
    createdRoles.push(createdRole)
    console.log(`Rôle créé : ${role.name}`)
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash('lesagecode', 10)

  // Création de l'utilisateur
  const user = await prisma.user.create({
    data: {
      full_name: "Le sage",
      email: "angezanou00@gmail",
      role_id: createdRoles[1].id, // ADMIN role
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

  // Création des clients
  const guests = await Promise.all([
    prisma.guest.create({
      data: {
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33123456789',
        address: '123 Rue de Paris',
        city: 'Paris',
        country: 'France',
        postal_code: '75001'
      }
    }),
    prisma.guest.create({
      data: {
        first_name: 'Marie',
        last_name: 'Martin',
        email: 'marie.martin@email.com',
        phone: '+33234567890',
        address: '456 Avenue des Champs-Élysées',
        city: 'Paris',
        country: 'France',
        postal_code: '75008'
      }
    }),
    prisma.guest.create({
      data: {
        first_name: 'Pierre',
        last_name: 'Bernard',
        email: 'pierre.bernard@email.com',
        phone: '+33345678901',
        address: '789 Boulevard Saint-Germain',
        city: 'Paris',
        country: 'France',
        postal_code: '75006'
      }
    }),
    prisma.guest.create({
      data: {
        first_name: 'Sophie',
        last_name: 'Petit',
        email: 'sophie.petit@email.com',
        phone: '+33456789012',
        address: '321 Rue de Rivoli',
        city: 'Paris',
        country: 'France',
        postal_code: '75004'
      }
    }),
    prisma.guest.create({
      data: {
        first_name: 'Lucas',
        last_name: 'Moreau',
        email: 'lucas.moreau@email.com',
        phone: '+33567890123',
        address: '654 Avenue Montaigne',
        city: 'Paris',
        country: 'France',
        postal_code: '75008'
      }
    }),
    prisma.guest.create({
      data: {
        first_name: 'Emma',
        last_name: 'Dubois',
        email: 'emma.dubois@email.com',
        phone: '+33678901234',
        address: '987 Rue du Faubourg Saint-Honoré',
        city: 'Paris',
        country: 'France',
        postal_code: '75008'
      }
    }),
    prisma.guest.create({
      data: {
        first_name: 'Thomas',
        last_name: 'Robert',
        email: 'thomas.robert@email.com',
        phone: '+33789012345',
        address: '147 Avenue des Ternes',
        city: 'Paris',
        country: 'France',
        postal_code: '75017'
      }
    }),
    prisma.guest.create({
      data: {
        first_name: 'Chloé',
        last_name: 'Richard',
        email: 'chloe.richard@email.com',
        phone: '+33890123456',
        address: '258 Rue de Vaugirard',
        city: 'Paris',
        country: 'France',
        postal_code: '75015'
      }
    }),
    prisma.guest.create({
      data: {
        first_name: 'Antoine',
        last_name: 'Simon',
        email: 'antoine.simon@email.com',
        phone: '+33901234567',
        address: '369 Boulevard Haussmann',
        city: 'Paris',
        country: 'France',
        postal_code: '75008'
      }
    }),
    prisma.guest.create({
      data: {
        first_name: 'Julie',
        last_name: 'Laurent',
        email: 'julie.laurent@email.com',
        phone: '+33012345678',
        address: '741 Rue Saint-Honoré',
        city: 'Paris',
        country: 'France',
        postal_code: '75001'
      }
    })
  ])

  // Création des réservations (demandes initiales)
  const reservations = await Promise.all([
    prisma.reservation.create({
      data: {
        reference: 'RES-A1B2C3',
        check_in: new Date('2025-07-01'),
        check_out: new Date('2025-07-05'),
        status: 'en_attente',
        room_id: rooms[0].id,
        guest_id: guests[0].id,
        recorded_by_id: 1
      }
    }),
    prisma.reservation.create({
      data: {
        reference: 'RES-D4E5F6',
        check_in: new Date('2025-07-10'),
        check_out: new Date('2025-07-15'),
        status: 'confirmée',
        room_id: rooms[1].id,
        guest_id: guests[1].id,
        recorded_by_id: 1
      }
    }),
    prisma.reservation.create({
      data: {
        reference: 'RES-G7H8I9',
        check_in: new Date('2025-07-20'),
        check_out: new Date('2025-07-25'),
        status: 'annulée',
        room_id: rooms[2].id,
        guest_id: guests[2].id,
        recorded_by_id: 1
      }
    }),
    prisma.reservation.create({
      data: {
        reference: 'RES-J1K2L3',
        check_in: new Date('2025-08-01'),
        check_out: new Date('2025-08-05'),
        status: 'en_attente',
        room_id: rooms[3].id,
        guest_id: guests[3].id,
        recorded_by_id: 1
      }
    }),
    prisma.reservation.create({
      data: {
        reference: 'RES-M4N5O6',
        check_in: new Date('2025-08-10'),
        check_out: new Date('2025-08-15'),
        status: 'confirmée',
        room_id: rooms[4].id,
        guest_id: guests[4].id,
        recorded_by_id: 1
      }
    }),
    prisma.reservation.create({
      data: {
        reference: 'RES-P7Q8R9',
        check_in: new Date('2025-08-20'),
        check_out: new Date('2025-08-25'),
        status: 'en_attente',
        room_id: rooms[5].id,
        guest_id: guests[5].id,
        recorded_by_id: 1
      }
    }),
    prisma.reservation.create({
      data: {
        reference: 'RES-S1T2U3',
        check_in: new Date('2025-09-01'),
        check_out: new Date('2025-09-05'),
        status: 'confirmée',
        room_id: rooms[6].id,
        guest_id: guests[6].id,
        recorded_by_id: 1
      }
    }),
    prisma.reservation.create({
      data: {
        reference: 'RES-V4W5X6',
        check_in: new Date('2025-09-10'),
        check_out: new Date('2025-09-15'),
        status: 'annulée',
        room_id: rooms[7].id,
        guest_id: guests[7].id,
        recorded_by_id: 1
      }
    }),
    prisma.reservation.create({
      data: {
        reference: 'RES-Y7Z8A9',
        check_in: new Date('2025-09-20'),
        check_out: new Date('2025-09-25'),
        status: 'en_attente',
        room_id: rooms[8].id,
        guest_id: guests[8].id,
        recorded_by_id: 1
      }
    }),
    prisma.reservation.create({
      data: {
        reference: 'RES-B1C2D3',
        check_in: new Date('2025-10-01'),
        check_out: new Date('2025-10-05'),
        status: 'confirmée',
        room_id: rooms[9].id,
        guest_id: guests[9].id,
        recorded_by_id: 1
      }
    })
  ])

  // Création des réservations
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        reference: 'BK-A1B2C3',
        check_in: new Date('2025-02-01'),
        check_out: new Date('2025-02-05'),
        guest_id: guests[0].id,
        room_id: rooms[0].id,
        total_amount: 500,
        status: 'confirmed',
        notes: 'Demande lit bébé'
      }
    }),
    prisma.booking.create({
      data: {
        reference: 'BK-D4E5F6',
        check_in: new Date('2025-02-10'),
        check_out: new Date('2025-02-15'),
        guest_id: guests[1].id,
        room_id: rooms[1].id,
        total_amount: 750,
        status: 'pending',
        notes: 'Vue sur mer demandée'
      }
    }),
    prisma.booking.create({
      data: {
        reference: 'BK-G7H8I9',
        check_in: new Date('2025-03-01'),
        check_out: new Date('2025-03-03'),
        guest_id: guests[2].id,
        room_id: rooms[2].id,
        total_amount: 400,
        status: 'confirmed',
        notes: 'Petit-déjeuner inclus'
      }
    }),
    prisma.booking.create({
      data: {
        reference: 'BK-J1K2L3',
        check_in: new Date('2025-03-15'),
        check_out: new Date('2025-03-20'),
        guest_id: guests[3].id,
        room_id: rooms[3].id,
        total_amount: 1500,
        status: 'confirmed',
        notes: 'Package spa inclus'
      }
    }),
    prisma.booking.create({
      data: {
        reference: 'BK-M4N5O6',
        check_in: new Date('2025-04-01'),
        check_out: new Date('2025-04-05'),
        guest_id: guests[4].id,
        room_id: rooms[4].id,
        total_amount: 2000,
        status: 'pending',
        notes: 'Demande parking'
      }
    }),
    prisma.booking.create({
      data: {
        reference: 'BK-P7Q8R9',
        check_in: new Date('2025-04-10'),
        check_out: new Date('2025-04-15'),
        guest_id: guests[5].id,
        room_id: rooms[5].id,
        total_amount: 4000,
        status: 'confirmed',
        notes: 'Service en chambre requis'
      }
    }),
    prisma.booking.create({
      data: {
        reference: 'BK-S1T2U3',
        check_in: new Date('2025-05-01'),
        check_out: new Date('2025-05-03'),
        guest_id: guests[6].id,
        room_id: rooms[6].id,
        total_amount: 160,
        status: 'cancelled',
        notes: 'Annulation client'
      }
    }),
    prisma.booking.create({
      data: {
        reference: 'BK-V4W5X6',
        check_in: new Date('2025-05-15'),
        check_out: new Date('2025-05-20'),
        guest_id: guests[7].id,
        room_id: rooms[7].id,
        total_amount: 900,
        status: 'confirmed',
        notes: 'Arrivée tardive'
      }
    }),
    prisma.booking.create({
      data: {
        reference: 'BK-Y7Z8A9',
        check_in: new Date('2025-06-01'),
        check_out: new Date('2025-06-05'),
        guest_id: guests[8].id,
        room_id: rooms[8].id,
        total_amount: 1250,
        status: 'pending',
        notes: 'Demande étage calme'
      }
    }),
    prisma.booking.create({
      data: {
        reference: 'BK-B1C2D3',
        check_in: new Date('2025-06-10'),
        check_out: new Date('2025-06-15'),
        guest_id: guests[9].id,
        room_id: rooms[9].id,
        total_amount: 5000,
        status: 'confirmed',
        notes: 'Suite présidentielle'
      }
    })
  ])

  // Création des factures
  const factures = await Promise.all([
    prisma.facture.create({
      data: {
        amount: 500,
        status: 'payée',
        booking_id: bookings[0].id
      }
    }),
    prisma.facture.create({
      data: {
        amount: 750,
        status: 'en_attente',
        booking_id: bookings[1].id
      }
    }),
    prisma.facture.create({
      data: {
        amount: 400,
        status: 'payée',
        booking_id: bookings[2].id
      }
    }),
    prisma.facture.create({
      data: {
        amount: 1500,
        status: 'payée',
        booking_id: bookings[3].id
      }
    }),
    prisma.facture.create({
      data: {
        amount: 2000,
        status: 'en_attente',
        booking_id: bookings[4].id
      }
    }),
    prisma.facture.create({
      data: {
        amount: 4000,
        status: 'payée',
        booking_id: bookings[5].id
      }
    }),
    prisma.facture.create({
      data: {
        amount: 160,
        status: 'annulée',
        booking_id: bookings[6].id
      }
    }),
    prisma.facture.create({
      data: {
        amount: 900,
        status: 'payée',
        booking_id: bookings[7].id
      }
    }),
    prisma.facture.create({
      data: {
        amount: 1250,
        status: 'en_attente',
        booking_id: bookings[8].id
      }
    }),
    prisma.facture.create({
      data: {
        amount: 5000,
        status: 'payée',
        booking_id: bookings[9].id
      }
    })
  ])

  console.log('Données de test créées avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
