import { z } from 'zod'

export const PayrollPeriodSchema = z.object({
  name: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.enum(['processing', 'done']).default('processing').optional(),
  payType: z.enum(['monthly', 'daily']).optional(),
})

export type PayrollPeriod = z.infer<typeof PayrollPeriodSchema>
