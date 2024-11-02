import { z } from 'zod'

const transactionItemSchema = z.object({
  goodsId: z.string(),
  qty: z.string(),
  price: z.string().optional(),
  type: z.enum(['in', 'out', 'opname', 'borrowed', 'returned']),
})

export const schema = z.object({
  date: z.string(),
  items: z.array(transactionItemSchema),
  supplierId: z.string().optional(),
})

export type TransactionItem = z.infer<typeof transactionItemSchema>
export type Transaction = z.infer<typeof schema>
