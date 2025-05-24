import { z } from 'zod'

export const LoanSchema = z.object({
  inventoryId: z.string(),
  requestQuantity: z.coerce.number().min(1),
  requestDate: z.coerce.date(),
  note: z.string().optional(),
  photoUrlIn: z.any(),
  projectId: z.string(),
})

export const ReturnLoanSchema = z.object({
  returnedQuantity: z.coerce.number().nullable().optional(),
  returnDate: z.coerce.date(),
  photoUrlOut: z.any(),
})

export type Loan = z.infer<typeof LoanSchema>
