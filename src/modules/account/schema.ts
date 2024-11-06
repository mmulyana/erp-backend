import { string, z } from 'zod'

const phoneNumberRegex =
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
const passwordLength = 8

const baseSchema = {
  name: z
    .string()
    .min(1, 'Nama harus lebih dari 1 huruf')
    .nullable()
    .optional(),
  email: z.string().email('Format email salah').nullable().optional(),
  phoneNumber: z
    .string()
    .regex(phoneNumberRegex, 'Format nomor telepon salah')
    .nullable()
    .optional(),
  employeeId: z.number().int().positive().nullable().optional(),
}

export const createAccountSchema = z
  .object({
    ...baseSchema,
    password: z
      .string()
      .min(passwordLength, `Password minimal ${passwordLength} karakter`),
    permissions: string().array(),
  })
  .strict()

export const updateAccountSchema = z
  .object({
    ...baseSchema,
    password: z
      .string()
      .min(passwordLength, `Password minimal ${passwordLength} karakter`)
      .optional(),
  })
  .partial()
  .strict()

export type CreateAccountSchema = z.infer<typeof createAccountSchema>
export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>
