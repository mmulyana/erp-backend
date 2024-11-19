import { z } from 'zod'

export const attachmentSchema = z.object({
  name: z.string(),
  uploaded_by: z.string().optional().nullable(),
  projectId: z.string(),
  isSecret: z.string().optional(),
  type: z.string().optional(),
})
export const updateSchema = attachmentSchema.partial()
export type Attachment = z.infer<typeof attachmentSchema>
