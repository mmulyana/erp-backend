import { z } from 'zod'

const permissionSchema = {
  create: z.object({
    name: z.string(),
    groupId: z.number()
  }),
  update: z.object({
    name: z.string(),
    groupId: z.number()
  }),
}

export default permissionSchema
