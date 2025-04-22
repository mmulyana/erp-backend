import { z } from 'zod'

export const LocationSchema = z.object({
  name: z.string(),
})
export type Location = z.infer<typeof LocationSchema>
