import { z } from 'zod'

export const StockOutSchema = z.object({
  note: z.string().optional(),
  date: z.coerce.date({
    errorMap: ({ code }, { defaultError }) => {
      if (code == 'invalid_date') return { message: 'Tidak boleh kosong' }
      return { message: defaultError }
    },
  }),
  projectId: z.string().nullable().optional(),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1, 'Tidak boleh kosong'),
        quantity: z.coerce.number().int().positive('Tidak boleh nol'),
        unitPrice: z.coerce.number().int().optional(),
      }),
    )
    .min(1, 'Minimal satu barang harus diisi'),
})

export type StockOut = z.infer<typeof StockOutSchema>
