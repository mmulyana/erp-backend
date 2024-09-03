import { z } from 'zod'

export const attendanceSchema = z.object({
  employeeId: z.number(),
  date: z.string().date(),
  total_hour: z.number(),
  isOnLeave: z.boolean().optional(),
  leaveId: z.number().optional(),
})
