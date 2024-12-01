import { z } from 'zod'

export const createSchema = z.object({
  message: z.string(),
  userId: z.number(),
  type: z.enum(['feature', 'bug']),
})

export const updateSchema = createSchema.partial().extend({
  resolve: z.boolean(),
})

export type HelpdeskSchema = z.infer<typeof createSchema>
