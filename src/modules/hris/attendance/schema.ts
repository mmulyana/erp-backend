import { z } from 'zod'

export const AttendanceSchema = z.object({
  employeeId: z.string().uuid(),
  date: z.coerce.date(),
  type: z.enum(['presence', 'absent']),
})

export type Attendance = z.infer<typeof AttendanceSchema>
