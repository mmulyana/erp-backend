import { z } from 'zod'

export const employeeSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  nickname: z.string().optional(),
  hireDate: z.string().optional(),
  salary: z.number().optional(),
  status: z.string().optional(),
  positionId: z.number().optional(),
})

export const contactSchema = z.object({
  type: z.string().optional(),
  value: z.string(),
})

export const createAddressSchema = z.object({
  type: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
  kampung: z.string().optional(),
  desa: z.string().optional(),
  kecamatan: z.string().optional(),
  kebupaten: z.string().optional(),
  provinsi: z.string().optional(),
  kodePos: z.number().optional(),
})

export const updateAddressSchema = z.object({
  id: z.number(),
  type: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
  kampung: z.string().optional(),
  desa: z.string().optional(),
  kecamatan: z.string().optional(),
  kebupaten: z.string().optional(),
  provinsi: z.string().optional(),
  kodePos: z.number().optional(),
})

export const deleteAddress = z.object({
  id: z.number(),
})

export const positionSchema = z.object({
  positionId: z.number(),
})