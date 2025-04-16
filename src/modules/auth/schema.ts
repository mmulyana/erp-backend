import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type Login = z.infer<typeof LoginSchema>
