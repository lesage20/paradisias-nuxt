import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schéma de validation
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
})

export default defineEventHandler(async (event) => {
  try {
    // Récupération et validation des données
    const body = await readBody(event)
    const validatedData = loginSchema.parse(body)

    // Recherche de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        role: {
          select: {
            name: true
          }
        }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Création de la session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
      }
    })

    // On ne renvoie pas le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return {
      message: 'Connexion réussie',
      user: userWithoutPassword,
      sessionToken: session.id
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
