import { z } from "zod"

export const attachmentSchema = z.object({
    name: z.string(),
    uploaded_by: z.number().optional().nullable(),
    projectId: z.number(),
    isSecret: z.boolean().default(false),
  })
  export type Attachment = z.infer<typeof attachmentSchema>