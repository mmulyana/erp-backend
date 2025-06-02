import { z } from 'zod'

export const SupplierSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  googleMapUrl: z.string().optional(),
})

export type Supplier = z.infer<typeof SupplierSchema>
