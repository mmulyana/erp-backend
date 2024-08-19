import { z } from 'zod'

const RolesSchema = {
  create: z.object({
    name: z.string(),
  }),
  update: z.object({
    name: z.string(),
  }),
  add: z.object({
    name: z.string(),
    rolesId: z.number(),
  }),
  change: z.object({
    name: z.string(),
    rolesId: z.number(),
  }),
  remove: z.object({
    name: z.string(),
  }),
}

export default RolesSchema
