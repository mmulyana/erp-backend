import { z } from 'zod'

export const activitySchema = z.object({
  userId: z.number(),
  comment: z.string(),
  projectId: z.number(),
  replyId: z.number().optional().nullable(),
})
export type Activity = z.infer<typeof activitySchema>
