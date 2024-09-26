import { z } from 'zod'

export const supplierSchema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'nonactive']),
  tags: z.number().array().optional(),
})
export type Supplier = z.infer<typeof supplierSchema>
