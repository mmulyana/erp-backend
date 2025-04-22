import { z } from 'zod'

export const SupplierSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
})

export type Supplier = z.infer<typeof SupplierSchema>
