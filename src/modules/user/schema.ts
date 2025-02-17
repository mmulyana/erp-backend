import { z } from 'zod'
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  Messages,
} from '../../utils/constant'

export const CreateAccountSchema = z.object({
  username: z.string().min(1, Messages.InvalidName),
  email: z.string().email(Messages.InvalidEmail).optional().nullable(),
  phone: z.string().min(10).optional().nullable(),
  roleId: z.string().optional().nullable(),
})

export const UpdateAccountSchema = CreateAccountSchema.partial()

export const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, Messages.InvalidOldPassword),
    newPassword: z.string().min(8, Messages.InvalidPassword),
  })
  .strict()

export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>
export type CreateAccount = z.infer<typeof CreateAccountSchema>
export type UpdateAccount = z.infer<typeof UpdateAccountSchema>
