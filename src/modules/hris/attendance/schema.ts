import { z } from 'zod'

export const createAttendanceSchema = z.object({
  employeeId: z.number(),
  date: z.string().datetime(),
  total_hour: z.number(),
  type: z.string(),
  leaveId: z.number().optional()
})
export const updateAttendanceSchema = z.object({
  date: z.string().datetime(),
  total_hour: z.number(),
  type: z.string(),
  leaveId: z.number().optional()
})
