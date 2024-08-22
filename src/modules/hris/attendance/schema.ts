import { z } from 'zod'

export const attendanceSchema = z.object({
  employeeId: z.number(),
  date: z.string().date(),
  timeIn: z.string(),
  timeOut: z.string(),
  period: z.number(),
  isOnLeave: z.boolean().optional(),
  leaveId: z.number().optional(),
})
