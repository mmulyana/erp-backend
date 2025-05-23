import { z } from 'zod'

export const LoanSchema = z.object({
  inventoryId: z.string(),
  requestQuantity: z.coerce.number(),
  returnedQuantity: z.coerce.number().nullable().optional(),
  requestDate: z.coerce.date(),
  returnedDate: z.coerce.date().nullable().optional(),
  note: z.string().optional(),
  photoUrlOut: z.string().optional(),
  photoUrlIn: z.string().optional(),
  projectId: z.string(),
})

export type Loan = z.infer<typeof LoanSchema>
