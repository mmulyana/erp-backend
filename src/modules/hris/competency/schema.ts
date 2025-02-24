import { z } from 'zod'

export const CompetencySchema = z.object({
  name: z.string(),
  color: z.string().optional(),
})

export type Competency = z.infer<typeof CompetencySchema>
