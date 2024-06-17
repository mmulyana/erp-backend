import { z } from 'zod'

const permissionSchema = {
  create: z.object({
    name: z.string(),
  }),
  update: z.object({
    name: z.string(),
  }),
}

export default permissionSchema
