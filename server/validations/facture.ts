import { z } from 'zod'

export const createFactureSchema = z.object({
  amount: z.number().min(0, 'Le montant doit être positif'),
  status: z.string().min(1, 'Le statut est requis').max(15, 'Le statut ne doit pas dépasser 15 caractères'),
  booking_id: z.number().min(1, 'La réservation est requise')
})

export const updateFactureSchema = createFactureSchema.partial().extend({
  id: z.number()
})

export type CreateFactureInput = z.infer<typeof createFactureSchema>
export type UpdateFactureInput = z.infer<typeof updateFactureSchema>
