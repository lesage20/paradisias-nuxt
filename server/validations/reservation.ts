import { z } from 'zod'

export const createReservationSchema = z.object({
  reference: z.string().max(10, 'La référence ne doit pas dépasser 10 caractères').optional(),
  check_in: z.date({ required_error: "La date d'arrivée est requise" }),
  check_out: z.date({ required_error: 'La date de départ est requise' }),
  status: z.string().min(1, 'Le statut est requis').max(15, 'Le statut ne doit pas dépasser 15 caractères'),
  room_id: z.number().min(1, 'La chambre est requise'),
  guest_id: z.number().min(1, 'Le client est requis'),
  recorded_by_id: z.number().min(1, "L'utilisateur qui enregistre est requis")
})

export const updateReservationSchema = createReservationSchema.partial().extend({
  id: z.number()
})

export type CreateReservationInput = z.infer<typeof createReservationSchema>
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>
