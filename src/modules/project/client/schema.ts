import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string(),
  companyId: z.number().optional(),
})

export type Client = z.infer<typeof clientSchema>