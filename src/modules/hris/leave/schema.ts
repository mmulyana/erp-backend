import { z } from 'zod'

export const leaveSchema = z.object({
  employeeId: z.number(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  leaveType: z.enum(['vacation', 'sick', 'personal', 'maternity', 'paternity']),
  status: z.enum(['pending', 'approved', 'rejected']),
})
