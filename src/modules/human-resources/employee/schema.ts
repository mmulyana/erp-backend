import { z } from 'zod'

export const employeeSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  nickname: z.string().optional(),
  hireDate: z.string().optional(),
  salary: z.number().optional(),
  status: z.enum(['active', 'nonactive']).optional(),
  positionId: z.number().optional(),
})

export const ContactSchema = z.object({
  id: z.number().optional(),
  type: z.enum(['email', 'phoneNumber', 'socialMedia']).optional(),
  value: z.string(),
})

export const AddressSchema = z.object({
  id: z.number().optional(),
  type: z.enum(['domicile', 'origin']).optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
  kampung: z.string().optional(),
  desa: z.string().optional(),
  kecamatan: z.string().optional(),
  kebupaten: z.string().optional(),
  provinsi: z.string().optional(),
  kodePos: z.number().optional(),
})

export const DeleteAddressSchema = z.object({
  addressId: z.number(),
})

export const DeleteContactSchema = z.object({
  contactId: z.number(),
})

export const positionSchema = z.object({
  positionId: z.number(),
})

export const createCompetency = z.object({
  name: z.string(),
  certifications: z
    .object({
      name: z.string(),
      issuingOrganization: z.string(),
      issueDate: z.string(),
      expiryDate: z.string(),
    })
    .array()
    .optional(),
})

export const updateCompetency = z.object({
  id: z.number(),
  name: z.string(),
  certifications: z
    .object({
      id: z.number(),
      name: z.string(),
      issuingOrganization: z.string(),
      issueDate: z.string(),
      expiryDate: z.string(),
    })
    .array()
    .optional(),
})
