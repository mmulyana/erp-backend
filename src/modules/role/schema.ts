import { z } from 'zod'

export const CreateRoleSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})
export const UpdateRoleSchema = CreateRoleSchema.partial()

export type createRole = z.infer<typeof CreateRoleSchema>
export type updateRole = z.infer<typeof UpdateRoleSchema>
