import { z } from 'zod'

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Nama proyek tidak boleh kosong'),
  leadId: z.string().nullable().optional(),
  clientId: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  progressPercentage: z.number().optional(),
  paymentPercentage: z.number().optional(),
  netValue: z.number().nullable().optional(),
  status: z
    .enum(['NOT_STARTED', 'OFFERING', 'DOING', 'BILLING', 'DONE'])
    .default('NOT_STARTED'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
  deadlineAt: z.coerce.date().nullable().optional(),
  doneAt: z.coerce.date().nullable().optional(),
  employeeIds: z.string().array().nullable().optional(),
})

export const AssignedSchema = z.object({
  projectId: z.string(),
  employeeId: z.string(),
  startDate: z.coerce.date().optional(),
  endDate: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.coerce.date().optional(),
  ),
})

export const AttachmentSchema = z.object({
  type: z.string(),
  secret: z.coerce.boolean().default(false),
  name: z.string(),
  projectId: z.string(),
})

export const ReportSchema = z.object({
  projectId: z.string(),
  message: z.string(),
  type: z.string(),
})

export type Project = z.infer<typeof ProjectSchema>
export type Assigned = z.infer<typeof AssignedSchema>
export type Attachment = z.infer<typeof AttachmentSchema>
export type Report = z.infer<typeof ReportSchema>
