import { z } from 'zod'

export const overtimeSchema = z.object({
  employeeId: z.number(),
  date: z.string().datetime(),
  total_hour: z.number(),
  description: z.string().optional(),
})
