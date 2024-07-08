import { z } from 'zod'

const permissionGroupSchema = {
  create: z.object({
    name: z.string(),
    description: z.string().optional(),
    permissionNames: z.string().array().optional(),
  }),
  update: z.object({
    name: z.string(),
    description: z.string().optional(),
    permissionNames: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .array()
      .optional(),
    newPermissionNames: z.string().array().optional(),
  }),
}

export default permissionGroupSchema
