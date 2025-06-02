import { z } from 'zod'

export const StockOutSchema = z.object({
  note: z.string().optional(),
  date: z.coerce.date(),
  projectId: z.string().nullable().optional(),
  items: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        quantity: z.coerce.number().int().positive(),
        unitPrice: z.coerce.number().int().optional(),
      }),
    )
    .min(1, 'Minimal satu barang harus diisi'),
})

export type StockOut = z.infer<typeof StockOutSchema>
