import { z } from 'zod'

const RolesSchema = {
  create: z.object({
    name: z.string(),
    permissionIds: z.number().array().optional()
  }),
  update: z.object({
    name: z.string().optional(),
    permissionIds: z.number().array().optional()
  }),
}

export default RolesSchema
