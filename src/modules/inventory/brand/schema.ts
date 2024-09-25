import { z } from 'zod'

export const brandSchema = z.object({
  name: z.string(),
})

export type Brand = z.infer<typeof brandSchema>
