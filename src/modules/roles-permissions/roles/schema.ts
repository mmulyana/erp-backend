import { z } from 'zod'

const RolesSchema = {
  create: z.object({
    name: z.string(),
  }),
  update: z.object({
    name: z.string(),
  }),
}

export default RolesSchema
