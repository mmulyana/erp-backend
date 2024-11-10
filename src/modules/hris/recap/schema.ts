import { z } from 'zod'

export const schema = z.object({
  name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
})
export const updateSchema = schema.partial()
export type Recap = z.infer<typeof schema>
