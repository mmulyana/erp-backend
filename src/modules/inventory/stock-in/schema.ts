import { z } from 'zod'

export const StockInSchema = z.object({
  referenceNumber: z.string().optional(),
  supplierId: z.string().nullable().optional(),
  note: z.string().optional(),
  date: z.coerce.date({
    errorMap: ({ code }, { defaultError }) => {
      if (code == 'invalid_date') return { message: 'Tidak boleh kosong' }
      return { message: defaultError }
    },
  }),
  photoUrl: z.any(),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1, 'Tidak boleh kosong'),
        quantity: z.coerce.number().int().positive('Tidak boleh nol'),
        unitPrice: z.coerce.number().int().positive('Tidak boleh nol'),
      }),
    )
    .min(1),
})

export type StockIn = z.infer<typeof StockInSchema>
