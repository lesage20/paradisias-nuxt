import { z } from 'zod'

export const createBookingSchema = z.object({
  reference: z.string().max(10, 'La référence ne doit pas dépasser 10 caractères').optional(),
  check_in: z.coerce.date({ required_error: "La date d'arrivée est requise" }),
  check_out: z.coerce.date({ required_error: 'La date de départ est requise' }),
  total_price: z.number().min(0, 'Le prix total doit être positif'),
  payment: z.string().min(1, 'Le mode de paiement est requis').max(15, 'Le mode de paiement ne doit pas dépasser 15 caractères'),
  adults: z.number().min(1, 'Il doit y avoir au moins un adulte'),
  children: z.number().min(0, 'Le nombre d\'enfants doit être positif'),
  status: z.enum(['confirmed', 'completed'], {
    required_error: 'Le statut est requis',
    invalid_type_error: 'Le statut doit être confirmed (en cours) ou completed (terminé)'
  }),
  room_id: z.number().min(1, 'La chambre est requise'),
  coupon_id: z.number().nullable().optional(),
  guest_id: z.number().min(1, 'Le client est requis'),
  recorded_by_id: z.number().min(1, "L'utilisateur qui enregistre est requis"),
  notes: z.string().max(500, 'Les notes ne doivent pas dépasser 500 caractères').optional()
})

export const updateBookingSchema = createBookingSchema.partial().extend({
  id: z.number().min(1, 'ID invalide')
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
