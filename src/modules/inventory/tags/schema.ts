import { z } from 'zod'

export const tagSchema = z.object({
  name: z.string(),
  color: z.string(),
})
export type Tag = z.infer<typeof tagSchema>
