import { z } from 'zod'

export const ClientSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  companyId: z.string().min(1).uuid().optional().nullable(),
})

export type Client = z.infer<typeof ClientSchema>
