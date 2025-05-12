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
  status: z
    .enum(['NOT_STARTED', 'OFFERING', 'DOING', 'BILLING', 'DONE'])
    .default('NOT_STARTED'),
})

export const AssignedSchema = z.object({
  projectId: z.string(),
  employeeId: z.string(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export const AttachmentSchema = z.object({
  type: z.string(),
  secret: z.coerce.boolean().default(false),
  name: z.string(),
  projectId: z.string(),
})

export type Project = z.infer<typeof ProjectSchema>
export type Assigned = z.infer<typeof AssignedSchema>
export type Attachment = z.infer<typeof AttachmentSchema>
