import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1, { message: 'Tidak boleh kosong' }),
  password: z.string(),
})

export type Login = z.infer<typeof LoginSchema>
