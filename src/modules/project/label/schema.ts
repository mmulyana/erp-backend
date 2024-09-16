import { z } from 'zod'

export const labelSchema = z.object({
  name: z.string(),
  color: z.string(),
})
export type Label = z.infer<typeof labelSchema>