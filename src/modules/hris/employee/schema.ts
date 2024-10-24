import { z } from 'zod'

const JoinedType = z.enum(['date', 'year'])
const PayType = z.enum(['daily', 'monthly'])
const EmploymentType = z.enum(['permanent', 'contract', 'partime'])
const Gender = z.enum(['male', 'female'])
const MaritalStatus = z.enum(['single', 'married', 'divorced'])

export const employeeSchema = z.object({
  fullname: z.string(),
  status: z.boolean().default(true),
  joined_at: z.string().optional().nullable(),
  joined_type: JoinedType.default('date').optional().nullable(),
  basic_salary: z.string().optional().nullable(),
  overtime_salary: z.string().optional().nullable(),
  pay_type: PayType.default('daily').optional().nullable(),
  employment_type: EmploymentType.default('permanent').optional().nullable(),
  place_of_birth: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  last_education: z.string().optional().nullable(),
  gender: Gender.optional().nullable(),
  marital_status: MaritalStatus.optional().nullable(),
  religion: z.string().optional().nullable(),
  positionId: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  safety_induction_date: z.string().datetime().optional().nullable(),
  addresses: z
    .object({
      type: z.enum(['domicile', 'origin', 'alternative']),
      value: z.string(),
    })
    .array()
    .optional()
    .nullable(),
  phoneNumbers: z
    .object({
      value: z.string(),
    })
    .array()
    .optional()
    .nullable(),
  competencies: z.string().array().optional().nullable(),
})

export const updateEmployeeSchema = employeeSchema
  .omit({
    fullname: true,
    addresses: true,
    competencies: true,
    phoneNumbers: true,
    positionId: true,
  })
  .partial()

export const contactSchema = z.object({
  id: z.number().optional(),
  value: z.string(),
})

export const addressSchema = z.object({
  type: z.enum(['domicile', 'origin', 'alternative']).optional(),
  value: z.string(),
})

export const deleteAddressSchema = z.object({
  addressId: z.number(),
})

export const deleteContactSchema = z.object({
  contactId: z.number(),
})

export const positionSchema = z.object({
  positionId: z.number(),
})

export const competencySchema = z.object({
  competencyId: z.number().array(),
})

export const competencySingleSchema = z.object({
  competencyId: z.number(),
})

export const certifchema = z.object({
  certif_name: z.string(),
  issuing_organization: z.string().optional(),
  issue_year: z.string().optional(),
  issue_month: z.string().optional(),
  expiry_year: z.string().optional(),
  expiry_month: z.string().optional(),
  competencyId: z.string().optional(),
})
