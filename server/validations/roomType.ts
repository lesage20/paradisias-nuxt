import { z } from 'zod'

export const createRoomTypeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  numberAdult: z.number().min(1, 'Le nombre d\'adultes doit être supérieur à 0'),
  numberChildren: z.number().min(0, 'Le nombre d\'enfants ne peut pas être négatif'),
  price: z.number().min(0, 'Le prix ne peut pas être négatif'),
})

export const updateRoomTypeSchema = createRoomTypeSchema.partial().extend({
  id: z.number(),
})

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>
