import { z } from 'zod'

const EmployeeStatus = z.enum(['active', 'inactive'])
const JoinedType = z.enum(['date', 'year'])
const PayType = z.enum(['daily', 'monthly'])
const EmploymentType = z.enum(['permanent', 'contract', 'partime'])
const Gender = z.enum(['male', 'female'])
const MaritalStatus = z.enum(['single', 'married', 'divorced'])

export const employeeSchema = z.object({
  fullname: z.string(),
  status: EmployeeStatus.default('active'),
  photo: z.string().optional().nullable(),
  joined_at: z.string().optional().nullable(),
  joined_type: JoinedType.default('date').optional().nullable(),
  basic_salary: z.number().positive().optional().nullable(),
  overtime_salary: z.number().positive().optional().nullable(),
  pay_type: PayType.default('daily').optional().nullable(),
  employment_type: EmploymentType.default('permanent').optional().nullable(),
  place_of_birth: z.string().optional().nullable(),
  birthdate: z.string().optional().nullable(),
  gender: Gender.optional().nullable(),
  marital_status: MaritalStatus.optional().nullable(),
  religion: z.string().optional().nullable(),
  positionId: z.number().int().positive().optional().nullable(),
  addresses: z
    .object({
      type: z.enum(['domicile', 'origin', 'alternative']),
      value: z.string(),
    })
    .array()
    .optional()
    .nullable(),
  contacts: z
    .object({
      type: z.enum(['email', 'phoneNumber', 'socialMedia']),
      value: z.string(),
    })
    .array()
    .optional()
    .nullable(),
  competencyIds: z.number().array().optional().nullable(),
})

export const contactSchema = z.object({
  id: z.number().optional(),
  type: z.enum(['email', 'phoneNumber', 'socialMedia']).optional(),
  value: z.string(),
})

export const addressSchema = z.object({
  type: z.enum(['domicile', 'origin']).optional(),
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

export const certifchema = z.object({
  competencyId: z.number(),
  name: z.string(),
  issuingOrganization: z.string(),
  issueDate: z.string(),
  expiryDate: z.string(),
})
