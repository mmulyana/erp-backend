import { z } from 'zod'

export const TransactionSchema = z.object({
  inventoryId: z.string(),
  type: z.enum(['stockIn', 'stockOut']),
  quantity: z.number(),
  resultQuantity: z.number(),
  note: z.string().optional(),
  date: z.coerce.date(),
})

export const StockInSchema = TransactionSchema.extend({
  supplierId: z.string(),
  price: z.number(),
})

export const StockOutSchema = TransactionSchema.extend({
  price: z.number(),
})

export type StockIn = z.infer<typeof StockInSchema>
export type StockOut = z.infer<typeof StockOutSchema>
