import { z } from 'zod'

export const cashAdvanceSchema = z.object({
  employeeId: z.number(),
  amount: z.number(),
  requestDate: z.string().date(),
  description: z.string().optional(),
})
