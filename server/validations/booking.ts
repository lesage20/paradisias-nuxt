import { z } from 'zod'

export const createBookingSchema = z.object({
  reference: z.string().max(10, 'La référence ne doit pas dépasser 10 caractères').optional(),
  check_in: z.date({ required_error: "La date d'arrivée est requise" }),
  check_out: z.date({ required_error: 'La date de départ est requise' }),
  total_price: z.number().min(0, 'Le prix total doit être positif'),
  payment: z.string().min(1, 'Le mode de paiement est requis').max(15, 'Le mode de paiement ne doit pas dépasser 15 caractères'),
  adults: z.number().min(1, 'Il doit y avoir au moins un adulte'),
  children: z.number().min(0, 'Le nombre d\'enfants doit être positif'),
  status: z.string().min(1, 'Le statut est requis').max(15, 'Le statut ne doit pas dépasser 15 caractères'),
  room_id: z.number().min(1, 'La chambre est requise'),
  coupon_id: z.number().optional(),
  guest_id: z.number().min(1, 'Le client est requis'),
  recorded_by_id: z.number().min(1, "L'utilisateur qui enregistre est requis")
})

export const updateBookingSchema = createBookingSchema.partial().extend({
  id: z.number()
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
