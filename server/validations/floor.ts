import { z } from 'zod'

export const createFloorSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  number: z.number().min(1, 'Le numéro doit être supérieur à 0'),
  status: z.enum(['actif', 'inactif']).default('inactif'),
})

export const updateFloorSchema = createFloorSchema.partial().extend({
  id: z.number(),
})

export type CreateFloorInput = z.infer<typeof createFloorSchema>
export type UpdateFloorInput = z.infer<typeof updateFloorSchema>
