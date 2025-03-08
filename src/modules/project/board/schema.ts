import { z } from 'zod'

export const BoardSchema = z.object({
  name: z.string(),
  color: z.string(),
})
export type Board = z.infer<typeof BoardSchema>
