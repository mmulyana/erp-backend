import { z } from 'zod'

export const BrandSchema = z.object({
  name: z.string(),
})

export type Brand = z.infer<typeof BrandSchema>
