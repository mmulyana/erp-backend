import { z } from 'zod'

export const OvertimeSchema = z.object({
  employeeId: z.string().uuid(),
  date: z.string(),
  totalHour: z.number(),
  note: z.string().optional(),
})

export type Overtime = z.infer<typeof OvertimeSchema>
