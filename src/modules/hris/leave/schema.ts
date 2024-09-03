import { z } from 'zod'

export const leaveSchema = z.object({
  employeeId: z.number(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  leaveType: z.string(),
  description: z.string().optional(),
})
