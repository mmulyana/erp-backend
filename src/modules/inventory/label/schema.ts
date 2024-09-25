import { z } from 'zod'

export const labelSchema = z.object({
  name: z.string(),
  color: z.string(),
})
export type Schema = z.infer<typeof labelSchema>
