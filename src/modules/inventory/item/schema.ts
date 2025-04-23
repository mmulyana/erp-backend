import { z } from 'zod'

export const ItemSchema = z.object({
  name: z.string(),
  locationId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  minimum: z.coerce.number().default(1),
  description: z.string().optional(),
  unitOfMeasurement: z.string().optional(),
})

export type Item = z.infer<typeof ItemSchema>
