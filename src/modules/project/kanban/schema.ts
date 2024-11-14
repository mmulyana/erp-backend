import { z } from 'zod'

export const boardContainer = z.object({
  name: z.string(),
  color: z.string(),
})

export const boardItems = z.object({
  name: z.string().min(1, "Nama proyek tidak boleh kosong"),
  containerId: z.string(),
  progress: z.number().optional().default(0),
  payment_status: z.number().optional().default(0),
  description: z.string().optional().nullable(),
  date_started: z.string().optional(),
  date_ended: z.string().optional(),
  isArchive: z.boolean().optional().default(false),
  isDeleted: z.boolean().optional().default(false),
  net_value: z.number().optional().nullable(),
  leadId: z.number().optional().nullable(),
  clientId: z.number().optional().nullable(),
  labels: z.number().array().optional(),
  employees: z.number().array().optional(),
})

export type Container = z.infer<typeof boardContainer>
export type Items = z.infer<typeof boardItems>
export type OrderItems = {
  source: any
  destination: any
}