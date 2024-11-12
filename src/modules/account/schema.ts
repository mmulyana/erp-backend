import { string, z } from 'zod'

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const phoneNumberRegex =
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
const passwordLength = 8

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Nama harus lebih dari 1 huruf'),
  email: z
    .string()
    .refine((val) => {
      if (val === '') return true
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    }, 'Format email salah')
    .nullable(),
  phoneNumber: z
    .string()
    .refine((val) => {
      if (val === '') return true
      return phoneNumberRegex.test(val)
    }, 'Format nomor telepon salah')
    .nullable(),
  // roleId: z.number().optional(),
})

export const updateAccountSchema = z
  .object({
    name: z.string().min(1, 'Nama harus lebih dari 1 huruf'),
    email: z.string().email('Format email salah').optional(),
    phoneNumber: z
      .string()
      .regex(phoneNumberRegex, 'Format nomor telepon salah')
      .optional(),
    employeeId: z.number().optional(),
    permissions: string().array().optional(),
    photo: z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      )
      .nullable()
      .optional(),
  })
  .partial()

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Password lama harus diisi'),
    newPassword: z.string().min(8, 'Password sekurangnya 8 karakter'),
  })
  .strict()

export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>
export type CreateAccountSchema = z.infer<typeof createAccountSchema>
export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>
