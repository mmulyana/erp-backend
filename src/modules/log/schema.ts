import { z } from 'zod'

export const updateSchema = z.object({
  userId: z.number(),
  action: z.string(),
  module: z.string(),
  description: z.string(),
  timestamp: z.string().datetime(),
})
