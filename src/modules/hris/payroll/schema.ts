import { z } from 'zod'

export const PayrollSchema = z.object({
  periodId: z.string(),
  employeeId: z.string(),
  workDays: z.number(),
  overtimeHours: z.number(),
  cashAdvance: z.number(),
  salary: z.number(),
  overtimeSalary: z.number(),
  status: z.enum(['draft', 'done']),
})

export type Payroll = z.infer<typeof PayrollSchema>
