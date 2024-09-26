import { z } from 'zod'

export const schema = z.object({
  name: z.string(),
  position: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['active', 'nonactive']),
  supplierId: z.number(),
})
export type EmployeeSupplierSchema = z.infer<typeof schema>
