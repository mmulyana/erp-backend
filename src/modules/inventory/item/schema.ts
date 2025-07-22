import { nullable, z } from 'zod'

export const ItemSchema = z.object({
  name: z.string().min(1, 'Tidak boleh kosong'),
  warehouseId: z.string().nullable().optional(),
  brandId: z.string().nullable().optional(),
  minimum: z.coerce.number().default(1),
  description: z.string().optional(),
  unitOfMeasurement: z.string().optional(),
  category: z.string().nullable().optional(),
  photoUrl: z.any(),
})

export type Item = z.infer<typeof ItemSchema>
