import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  permissionIds: z.number().array(),
})
export const updateRoleSchema = createRoleSchema.partial()

export type createRoleDTO = z.infer<typeof createRoleSchema>
export type updateRoleDTO = z.infer<typeof updateRoleSchema>