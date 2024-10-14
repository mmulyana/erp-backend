import { z } from 'zod'

export const createAttendanceSchema = z.object({
  employeeId: z.number(),
  date: z.string(),
  total_hour: z.number(),
  type: z.string(),
  leaveId: z.number().optional(),
})
export const updateAttendanceSchema = createAttendanceSchema
  .omit({
    employeeId: true,
  })
  .partial()
