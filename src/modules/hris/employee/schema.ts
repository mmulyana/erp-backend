import { z } from 'zod'

export const EmployeeSchema = z.object({
  fullname: z.string().min(1, { message: 'Nama pegawai tidak boleh kosong' }),
  position: z.string().optional(),
  birthDate: z
    .preprocess((val) => {
      if (val === '' || val == null) return null
      return new Date(val as string)
    }, z.date().nullable())
    .nullable()
    .optional(),
  joinedAt: z.preprocess((val) => {
    if (val === '' || val == null) return null
    return new Date(val as string)
  }, z.date()),
  safetyInductionDate: z
    .preprocess((val) => {
      if (val === '' || val == null) return null
      return new Date(val as string)
    }, z.date().nullable())
    .nullable()
    .optional(),
  lastEducation: z.string().nullable().optional(),
  salary: z
    .union([z.string(), z.number()])
    .transform((val) => (val === '' ? null : Number(val)))
    .nullable()
    .optional(),
  overtimeSalary: z
    .union([z.string(), z.number()])
    .transform((val) => (val === '' ? null : Number(val)))
    .nullable()
    .optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  photoName: z.string().optional(),
  active: z.preprocess((val) => {
    if (val === 'true') return true
    if (val === 'false') return false
    return val
  }, z.boolean().nullable().optional()),
  payType: z.enum(['monthly', 'daily']).default('daily'),
  nik: z.string().min(1),
})

export const CertificationSchema = z.object({
  name: z.string().min(1),
  publisher: z.string().nullable().optional(),
  issueDate: z
    .preprocess((val) => {
      if (val === '' || val == null) return null
      return new Date(val as string)
    }, z.date().nullable())
    .nullable()
    .optional(),
  expiryDate: z
    .preprocess((val) => {
      if (val === '' || val == null) return null
      return new Date(val as string)
    }, z.date().nullable())
    .nullable()
    .optional(),
})

export type Employee = z.infer<typeof EmployeeSchema>
export type Certification = z.infer<typeof CertificationSchema>
