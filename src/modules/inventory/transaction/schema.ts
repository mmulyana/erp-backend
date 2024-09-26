import { z } from 'zod'

export const schema = z.object({
  goodsId: z.number(),
  qty: z.number(),
  price: z.number(),
  supplierId: z.number(),
  date: z.string().datetime(),
  type: z.enum(['in', 'out', 'opname', 'borrowed', 'returned']),
  description: z.string().optional(),
})
export type Transaction = z.infer<typeof schema>
