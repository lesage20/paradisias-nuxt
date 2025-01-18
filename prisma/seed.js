import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import hotelData from '../hotel_data.json' assert { type: 'json' }

const prisma = new PrismaClient()

const SALT_ROUNDS = 10
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

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
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()

  // Création des rôles
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: 'admin',
        description: 'Administrateur du système'
      }
    }),
    prisma.role.create({
      data: {
        name: 'manager',
        description: 'Gestionnaire de l\'hôtel'
      }
    }),
    prisma.role.create({
      data: {
        name: 'receptionist',
        description: 'Réceptionniste'
      }
    })
  ])

  // Création des utilisateurs
  const users = await Promise.all([
    prisma.user.create({
      data: {
        full_name: 'Admin System',
        email: 'admin@paradisias.com',
        password: await hashPassword('admin123'),
        role_id: roles[0].id
      }
    }),
    prisma.user.create({
      data: {
        full_name: 'Manager Hotel',
        email: 'manager@paradisias.com',
        password: await hashPassword('manager123'),
        role_id: roles[1].id
      }
    }),
    prisma.user.create({
      data: {
        full_name: 'Réceptionniste',
        email: 'reception@paradisias.com',
        password: await hashPassword('reception123'),
        role_id: roles[2].id
      }
    })
  ])

  // Création des étages depuis hotel_data.json
  const floors = await Promise.all(
    hotelData.floors.map(floor => 
      prisma.floor.create({
        data: {
          name: floor.name,
          description: floor.description,
          number: floor.number,
          status: floor.status
        }
      })
    )
  )

  // Création des types de chambres depuis hotel_data.json
  const roomTypes = await Promise.all(
    hotelData.room_types.map(type => 
      prisma.room_Type.create({
        data: {
          name: type.name,
          description: type.description,
          number_adult: type.numberAdult,
          number_children: type.numberChildren,
          price: type.price
        }
      })
    )
  )

  // Création des chambres depuis hotel_data.json
  // On utilise le premier étage et type de chambre créés comme fallback
  const defaultFloorId = floors[0].id
  const defaultTypeId = roomTypes[0].id

  await Promise.all(
    hotelData.rooms.map(room => 
      prisma.room.create({
        data: {
          number: room.number,
          status: room.status,
          floor_id: defaultFloorId, // On utilise l'ID du premier étage créé
          type_id: defaultTypeId, // On utilise l'ID du premier type créé
        }
      })
    )
  )

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
