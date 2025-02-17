import { z } from 'zod'

export const LoginSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    password: z.string(),
  })
  .refine(
    (data) => {
      return Boolean(data.username || data.email || data.phone)
    },
    {
      message: 'Minimal isi salah satu: nama, email, atau nomor telepon',
      path: ['name', 'email', 'phone'],
    },
  )

export type Login = z.infer<typeof LoginSchema>
