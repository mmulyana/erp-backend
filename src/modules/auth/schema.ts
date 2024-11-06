import { z } from 'zod'

export const loginSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z
      .string()
      .regex(
        /^(\+62|62|0)[\s-]?8[1-9]{1}[\s-]?\d{3,4}[\s-]?\d{4,6}$/,
        'Nomor telepon tidak valid. Gunakan format: +628xxx, 08xxx, atau 628xxx'
      )
      .transform((val) => {
        let standardized = val.replace(/[-\s]/g, '')
        if (standardized.startsWith('0')) {
          standardized = '+62' + standardized.slice(1)
        } else if (standardized.startsWith('62')) {
          standardized = '+' + standardized
        }
        return standardized
      })
      .optional(),
    password: z.string(),
  })
  .refine(
    (data) => {
      return Boolean(data.name || data.email || data.phone)
    },
    {
      message: 'Minimal isi salah satu: nama, email, atau nomor telepon',
      path: ['name', 'email', 'phone'],
    }
  )
