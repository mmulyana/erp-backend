import { z } from 'zod'

export const EmployeeSchema = z.object({
  fullname: z.string().min(1, { message: 'Nama pegawai tidak boleh kosong' }),
  position: z.string(),
  birthDate: z
    .preprocess((val) => {
      if (val === '' || val == null) return null
      return new Date(val as string)
    }, z.date().nullable())
    .nullable()
    .optional(),
  joinedAt: z
    .preprocess((val) => {
      if (val === '' || val == null) return null
      return new Date(val as string)
    }, z.date().nullable())
    .nullable()
    .optional(),
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

export const StatusTrackSchema = z.object({
  note: z.string().optional(),
  status: z.boolean().optional(),
})

export type Employee = z.infer<typeof EmployeeSchema>
export type Certification = z.infer<typeof CertificationSchema>