import { z } from 'zod'
import { Messages } from '@/utils/constant'

export const AccountSchema = z.object({
  username: z.string().min(1, Messages.InvalidName),
  email: z.string().email(Messages.InvalidEmail).optional().nullable(),
  phone: z.string().min(10).optional().nullable(),
  roleId: z.string().optional().nullable(),
  password: z.string(),
  active: z.boolean().default(true),
})

export type Account = z.infer<typeof AccountSchema>
