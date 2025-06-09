import { z } from 'zod'

export const BrandSchema = z.object({
  name: z.string().min(1, "Tidak boleh kosong"),
})

export type Brand = z.infer<typeof BrandSchema>
