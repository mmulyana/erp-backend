import { z } from 'zod'

export const EmployeeSchema = z.object({
  fullname: z.string(),
  position: z.string(),
  birthDate: z.string().nullable().optional(),
  joinedAt: z.string().nullable().optional(),
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
})

export const CertificationSchema = z.object({
  employeeId: z.string().uuid(),
  name: z.string().min(1),
  publisher: z.string().nullable().optional(),
  issueDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),
})

export const StatusTrackSchema = z.object({
  note: z.string().optional(),
  status: z.boolean().optional(),
})

export type Employee = z.infer<typeof EmployeeSchema>
export type Certification = z.infer<typeof CertificationSchema>
export type StatusTrack = z.infer<typeof StatusTrackSchema>
