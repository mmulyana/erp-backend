import { z } from 'zod'

export const EmployeeSchema = z.object({
  id: z.string().uuid(),
  positionId: z.string().uuid().optional(),
  fullname: z.string().max(50),
  birthDate: z.string().nullable().optional(),
  joinedAt: z.string().nullable().optional(),
  active: z.boolean().nullable().default(true),
  phone: z.string().nullable().optional(),
  lastEducation: z.string().nullable().optional(),
  salary: z.number().int().nullable().optional(),
  overtimeSalary: z.number().int().nullable().optional(),
  safetyInductionDate: z.date().nullable().optional(),
  address: z.string().nullable().optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
  status: z.boolean().nullable().default(true),
})

export const CertificationSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  name: z.string().min(1),
  publisher: z.string().nullable().optional(),
  issueMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/)
    .nullable()
    .optional(),
  expiryMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/)
    .nullable()
    .optional(),
  issueYear: z
    .string()
    .regex(/^\d{4}$/)
    .nullable()
    .optional(),
  expiryYear: z
    .string()
    .regex(/^\d{4}$/)
    .nullable()
    .optional(),
})
export const UpdateCertificationSchema = CertificationSchema.extend({
  id: z.string(),
})

export const StatusTrackSchema = z.object({
  note: z.string().optional(),
  status: z.boolean().optional(),
})

export const CompetencySchema = z.object({
  competencyIds: z.string().array().optional(),
})

export type Employee = z.infer<typeof EmployeeSchema>
export type Certification = z.infer<typeof CertificationSchema>
export type StatusTrack = z.infer<typeof StatusTrackSchema>
export type Competency = z.infer<typeof CompetencySchema>
