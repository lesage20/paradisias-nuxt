import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schéma de validation
const registerSchema = z.object({
  fullName: z.string().min(3, 'Le nom complet doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  roleName: z.string().optional() // Rôle optionnel
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

    // Récupération du rôle
    let role
    if (validatedData.roleName) {
      // Si un rôle est spécifié, on le recherche
      role = await prisma.role.findUnique({
        where: { name: validatedData.roleName }
      })

      if (!role) {
        throw createError({
          statusCode: 400,
          message: 'Rôle invalide'
        })
      }
    } else {
      // Sinon, on utilise le rôle GERANT par défaut
      role = await prisma.role.findUnique({
        where: { name: 'GERANT' }
      })

      if (!role) {
        throw createError({
          statusCode: 500,
          message: 'Rôle GERANT non trouvé'
        })
      }
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        password: hashedPassword,
        roleId: role.id
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
