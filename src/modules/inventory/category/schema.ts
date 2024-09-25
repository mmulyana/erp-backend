import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string(),
})
export type Category = z.infer<typeof categorySchema>
