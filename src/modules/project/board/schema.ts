import { z } from 'zod'

export const boardSchema = z.object({
  name: z.string(),
  color: z.string(),
})
export type Board = z.infer<typeof boardSchema>
