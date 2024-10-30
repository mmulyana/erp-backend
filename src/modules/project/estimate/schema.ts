import { z } from 'zod'

export const estimateSchema = z.object({
  name: z.string(),
  price: z.number().optional().nullable(),
  qty: z.number().optional().nullable(),
  projectId: z.number(),
})
export const updateEstimate = estimateSchema.partial()
export type Estimate = z.infer<typeof estimateSchema>
