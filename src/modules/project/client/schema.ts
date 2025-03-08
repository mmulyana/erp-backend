import { z } from 'zod'

export const ClientSchema = z.object({
  companyId: z.string().optional(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  positon: z.string().optional(),
})

export type Client = z.infer<typeof ClientSchema>
