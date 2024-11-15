import { z } from 'zod'

export const activitySchema = z.object({
  userId: z.string(),
  comment: z.string().min(1, 'Komentar tidak boleh kosong'),
  projectId: z.string(),
  replyId: z.string().optional().nullable(),
  photo: z
    .array(z.any())
    .max(5, 'Maksimal 5 foto yang diperbolehkan')
    .optional(),
})
export const updateActivitySchema = activitySchema.partial().extend({
  deletedPhoto: z.string().optional(),
})
export type Activity = z.infer<typeof activitySchema>

export const toggleLikeSchema = z.object({
  id: z.number(),
  replyId: z.number(),
  userId: z.number(),
  projectId: z.number().optional(),
  type: z.string().optional(),
})
export type ToggleLike = z.infer<typeof toggleLikeSchema>

export const removeAttachmentSchema = z.object({
  ids: z.number().array(),
})
