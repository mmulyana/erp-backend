import { z } from 'zod'

export const createSchema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  companyId: z.string().optional(),
  positon: z.string().optional()
})

export const updateSchema = createSchema.partial()

export type Client = z.infer<typeof createSchema>
