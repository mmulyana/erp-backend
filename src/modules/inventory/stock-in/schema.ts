import { z } from 'zod'

export const StockInSchema = z.object({
  referenceNumber: z.string().optional(),
  supplierId: z.string().nullable().optional(),
  note: z.string().optional(),
  date: z.coerce.date(),
  photoUrl: z.any(),
  items: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        quantity: z.coerce.number().min(1),
        unitPrice: z.coerce.number().min(0),
      }),
    )
    .min(1),
})

export type StockIn = z.infer<typeof StockInSchema>
