import { z } from 'zod'

export const overtimeSchema = z.object({
  employeeId: z.number(),
  date: z.string(),
  total_hour: z.number(),
  description: z.string().optional(),
})
