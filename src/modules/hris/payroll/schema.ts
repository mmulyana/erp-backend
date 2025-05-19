import { z } from 'zod'

export const PayrollSchema = z.object({
  periodId: z.string(),
  employeeId: z.string(),
  workDay: z.number(),
  overtimeHour: z.number(),
  salary: z.number(),
  overtimeSalary: z.number(),
  deduction: z.number().optional(),
  note: z.string().optional(),
  status: z.enum(['draft', 'done']),
  paymentType: z.enum(['TRANSFER', 'CASH']),
})

export type Payroll = z.infer<typeof PayrollSchema>
