import { z } from 'zod'

export const commentSchema = z.object({
  userId: z.number(),
  comment: z.string(),
  projectId: z.number(),
})
export type Comment = z.infer<typeof commentSchema>
