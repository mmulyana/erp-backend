import { z } from 'zod'

const transactionItemSchema = z.object({
  goodsId: z.number(),
  qty: z.number(),
  price: z.number().optional().nullable(),
  type: z.enum(['in', 'out', 'opname', 'borrowed']),
})

export const schema = z.object({
  date: z.string(),
  items: z.array(transactionItemSchema),
  supplierId: z.number().optional().nullable(),
  projectId: z.number().optional().nullable(),
})

export const deleteSchema = z.object({
  deletedBy: z.number(),
  delete_reason: z.string().optional().nullable(),
})

export const updateSchema = z
  .object({
    goodsId: z.number(),
    qty: z.number(),
    price: z.number(),
    supplierId: z.number(),
    date: z.string().date(),
    projectId: z.number(),
    is_returned: z.boolean(),
  })
  .partial()

export type UpdateSchema = z.infer<typeof updateSchema>
export type DeleteSchema = z.infer<typeof deleteSchema>
export type TransactionItem = z.infer<typeof transactionItemSchema>
export type Transaction = z.infer<typeof schema>
