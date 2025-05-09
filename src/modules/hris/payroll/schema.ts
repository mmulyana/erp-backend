import { z } from 'zod'

export const PayrollPeriodSchema = z.object({
  name: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  totalSpending: z.number().default(0),
  status: z.enum(['processing', 'done']).default('processing'),
  payType: z.enum(['monthly', 'daily']).optional(),
})

export const PayrollSchema = z.object({
  payrollPeriodId: z.string(),
  employeeId: z.string(),
  workDays: z.number(),
  overtimeHours: z.number(),
  cashAdvance: z.number(),
  salary: z.number(),
  overtimeSalary: z.number(),
  status: z.enum(['draft', 'done']),
})

export type PayrollPeriod = z.infer<typeof PayrollPeriodSchema>
export type Payroll = z.infer<typeof PayrollSchema>
