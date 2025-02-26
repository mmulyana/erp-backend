import { z } from 'zod'

export const RecapSchema = z.object({
  name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
})
export type Recap = z.infer<typeof RecapSchema>
