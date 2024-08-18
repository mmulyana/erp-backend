import { z } from 'zod'

const rolePermissionSchema = {
  create: z.object({
    rolesId: z.number(),
    permissionId: z.number(),
  }),
  update: z.object({
    rolesId: z.number(),
    permissionId: z.number(),
  }),
}

export default rolePermissionSchema
