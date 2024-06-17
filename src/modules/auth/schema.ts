import { z } from 'zod'

export const AuthSchema = {
  login: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string(),
    })
    .refine((data) => data.name || data.email, {
      message: 'enter username or email',
      path: ['name', 'email'],
    }),
  register: z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: 'password must match',
      path: ['confirm password'],
    }),
}
