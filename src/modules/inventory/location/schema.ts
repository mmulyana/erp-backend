import { z } from 'zod'

export const locationSchema = z.object({
  name: z.string(),
})
export type Location = z.infer<typeof locationSchema>
