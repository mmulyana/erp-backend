import { z } from 'zod'

export const estimateSchema = z.object({
  items: z
    .object({
      id: z.number().nullable(),
      name: z.string(),
      price: z.number().optional().nullable(),
      qty: z.number().optional().nullable(),
    })
    .array(),
})
export type Estimate = z.infer<typeof estimateSchema>
