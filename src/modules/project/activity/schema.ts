import { z } from 'zod'

export const activitySchema = z.object({
  userId: z.number(),
  comment: z.string(),
  projectId: z.number(),
  replyId: z.number().optional().nullable(),
})
export type Activity = z.infer<typeof activitySchema>

export const toggleLikeSchema = z.object({
  activityId: z.number(),
  userId: z.number(),
})
export type ToggleLike = z.infer<typeof toggleLikeSchema>

export const removeAttachmentSchema = z.object({
  ids: z.number().array()
})