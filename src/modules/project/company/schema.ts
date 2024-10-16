import { z } from 'zod'

export const companySchema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
})
export type Company = z.infer<typeof companySchema>
