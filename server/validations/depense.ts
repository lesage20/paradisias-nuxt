import { z } from 'zod'

export const createDepenseSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(50, 'Le titre ne doit pas dépasser 50 caractères'),
  description: z.string().min(1, 'La description est requise'),
  amount: z.number().min(0, 'Le montant doit être positif'),
  date: z.date({ required_error: 'La date est requise' }),
  spent_by_id: z.number().min(1, "L'utilisateur qui a fait la dépense est requis")
})

export const updateDepenseSchema = createDepenseSchema.partial().extend({
  id: z.number()
})

export type CreateDepenseInput = z.infer<typeof createDepenseSchema>
export type UpdateDepenseInput = z.infer<typeof updateDepenseSchema>
