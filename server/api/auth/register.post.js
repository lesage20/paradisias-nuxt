import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schéma de validation
const registerSchema = z.object({
  fullName: z.string().min(3, 'Le nom complet doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

export default defineEventHandler(async (event) => {
  try {
    // Récupération et validation des données
    const body = await readBody(event)
    const validatedData = registerSchema.parse(body)

    // Vérification si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Cet email est déjà utilisé'
      })
    }

    // Récupération du rôle GERANT
    const gerantRole = await prisma.role.findFirst({
      where: { name: 'GERANT' }
    })

    if (!gerantRole) {
      throw createError({
        statusCode: 500,
        message: 'Rôle GERANT non trouvé'
      })
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        password: hashedPassword,
        roleId: gerantRole.id
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: {
          select: {
            name: true
          }
        },
        createdAt: true
      }
    })

    return {
      message: 'Compte créé avec succès',
      user
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: error.errors[0].message
      })
    }
    
    throw error
  }
})
