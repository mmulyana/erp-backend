import { z } from 'zod'

export const attendanceSchema = z.object({
  employeeId: z.number(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  leaveType: z.enum(['vacation', 'sick', 'personal', 'maternity', 'paternity']),
  status: z.enum(['pending', 'approved', 'rejected']),
})
