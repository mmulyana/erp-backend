import { z } from 'zod'

export const measurementSchema = z.object({
  name: z.string(),
})
export type Measurement = z.infer<typeof measurementSchema>
