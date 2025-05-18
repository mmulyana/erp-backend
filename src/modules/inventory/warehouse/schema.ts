import { z } from 'zod'

export const LocationSchema = z.object({
  name: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
})
export type Location = z.infer<typeof LocationSchema>
