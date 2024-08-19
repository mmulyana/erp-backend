import { z } from 'zod'

export const userRoleSchema = {
  create: z.object({
    ids: z.number().array(),
    userId: z.number(),
  }),
  update: z.object({
    ids: z.number().array(),
    userId: z.number(),
  }),
  delete: z.object({
    userId: z.number(),
  }),
}
