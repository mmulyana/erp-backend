import { z } from 'zod'

export const updateUserSchema = z.object({
  roleId: z.string().uuid().nullable().optional(),
  username: z.string().min(1, "Tidak boleh kosong").max(50),
  phone: z.string().max(13).nullable().optional(),
  email: z.string().email().max(255).nullable().optional(),
  active: z.boolean().optional(),
  photoUrl: z.any(),
})

export const resetPasswordSchema = z.object({
  oldPassword: z.string().min(8, 'Password lama minimal 8 karakter'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
