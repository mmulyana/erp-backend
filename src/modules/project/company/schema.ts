import { z } from 'zod'

export const companySchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
})
export type Company = z.infer<typeof companySchema>
