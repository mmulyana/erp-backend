import { z } from 'zod'

export const competencySchema = z.object({
  name: z.string(),
})
