import { z } from 'zod'

export const PayrollSchema = z.object({
  periodId: z.string(),
  employeeId: z.string(),
  workDay: z.coerce.number(),
  overtimeHour: z.coerce.number(),
  salary: z.coerce.number(),
  overtimeSalary: z.coerce.number(),
  deduction: z.coerce.number().optional(),
  note: z.string().optional(),
  status: z.enum(['draft', 'done']),
  paymentType: z.enum(['TRANSFER', 'CASH']),
  doneAt: z.coerce.date(),
})

export type Payroll = z.infer<typeof PayrollSchema>
