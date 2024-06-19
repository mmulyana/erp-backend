import { z } from 'zod'

export const AccountSchema = {
  create: z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().optional(),
    rolesId: z.number().optional(),
  }),
  update: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    rolesId: z.number().optional(),
  }),
}
