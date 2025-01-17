import { z } from 'zod'

export const createCouponSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(50, 'Le titre ne doit pas dépasser 50 caractères'),
  description: z.string().min(1, 'La description est requise'),
  discount: z.number().min(0, 'La réduction doit être positive').max(100, 'La réduction ne peut pas dépasser 100%'),
  code: z.string().min(1, 'Le code est requis').max(10, 'Le code ne doit pas dépasser 10 caractères')
})

export const updateCouponSchema = createCouponSchema.partial().extend({
  id: z.number()
})

export type CreateCouponInput = z.infer<typeof createCouponSchema>
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>
