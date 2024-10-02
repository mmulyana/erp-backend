import { z } from 'zod'

export const schema = z.object({
  goodsId: z.string(),
  qty: z.string(),
  price: z.string(),
  supplierId: z.string(),
  date: z.string(),
  type: z.enum(['in', 'out', 'opname', 'borrowed', 'returned']),
  description: z.string().optional(),
  projectId: z.string().optional(),
  isReturned: z.boolean().optional(),
})
export type Transaction = z.infer<typeof schema>
