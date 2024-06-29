import { z } from 'zod'

const permissionGroupSchema = {
  create: z.object({
    name: z.string(),
  }),
  update: z.object({
    name: z.string(),
  }),
}

export default permissionGroupSchema
