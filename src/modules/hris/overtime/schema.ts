import { z } from 'zod'

export const overtimeSchema = z.object({
  employeeId: z.number(),
  date: z.string().date(),
  total_hour: z.number(),
  description: z.string(),
})
