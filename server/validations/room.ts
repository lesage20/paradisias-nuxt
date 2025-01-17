import { z } from 'zod'

export const createRoomSchema = z.object({
  number: z.string().min(1, 'Le numéro est requis').max(5, 'Le numéro ne doit pas dépasser 5 caractères'),
  status: z.string().min(1, 'Le statut est requis').max(10, 'Le statut ne doit pas dépasser 10 caractères'),
  floor_id: z.number().min(1, "L'étage est requis"),
  type_id: z.number().min(1, 'Le type de chambre est requis')
})

export const updateRoomSchema = createRoomSchema.partial().extend({
  id: z.number()
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>
