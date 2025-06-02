import { z } from 'zod'

export const CompanySchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  photoUrl: z.any(),
})
export type Company = z.infer<typeof CompanySchema>
