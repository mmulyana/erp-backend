import { z } from 'zod'

const rolePermissionSchema = {
  create: z.object({
    enabled: z.boolean(),
    rolesId: z.number(),
    permissionId: z.number(),
  }),
  update: z.object({
    enabled: z.boolean(),
    rolesId: z.number(),
    permissionId: z.number(),
  }),
}

export default rolePermissionSchema
