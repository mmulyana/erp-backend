import { z } from 'zod'

export const supplierSchema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  tags: z.string().optional(),
})
export const updateSchema = supplierSchema.partial({
  name: true,
})

export const updateTagSchema = z.object({
  tagIds: z.number().array().optional(),
})
export type Supplier = z.infer<typeof supplierSchema>
