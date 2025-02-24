import { z } from 'zod'

export const CashAdvanceSchema = z.object({
  employeeId: z.string().uuid(),
  amount: z.number(),
  date: z.string().date(),
  note: z.string().optional().nullable(),
})

export type CashAdvance = z.infer<typeof CashAdvanceSchema>
