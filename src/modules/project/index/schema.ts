import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string(),
  containerId: z.string(),
  progress: z.number().optional().default(0),
  payment_status: z.number().optional().default(0),
  description: z.string().optional().nullable(),
  // date_created: z.string().datetime().optional(),
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
export const updateProjectSchema = createProjectSchema.partial()

export type Project = z.infer<typeof createProjectSchema>

export const addEmployeeSchema = z.object({
  employeeId: z.number(),
})
export const addLabelSchema = z.object({
  labelId: z.number(),
})
