import { z } from 'zod'

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Nama proyek tidak boleh kosong'),
  leadId: z.string().optional(),
  clientId: z.string().optional(),
  description: z.string().optional(),
  progressPercentage: z.number().optional(),
  paymentPercentage: z.number().optional(),
  netValue: z.bigint().optional(),
  startedAt: z.string().optional(),
  endedAt: z.string().optional(),
  archivedAt: z.string().optional(),
})
export const AssignedSchema = z.object({
  projectId: z.string(),
  employeeId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})
export const StatusSchema = z.object({
  containrId: z.string(),
})

export type Project = z.infer<typeof ProjectSchema>
export type Assigned = z.infer<typeof AssignedSchema>
