import { z } from 'zod'

export const CashAdvanceSchema = z.object({
  employeeId: z.string().uuid({ message: 'Pilih salah satu pegawai' }),
  amount: z.coerce.number().gt(0, { message: 'Tidak boleh nol' }),
  date: z.coerce.date(),
  note: z.string().optional().nullable(),
  status: z
    .enum(['paidOff', 'notYetPaidOff'])
    .optional()
    .default('notYetPaidOff'),
})

export const CashAdvanceTransactionSchema = z.object({
  cashAdvanceId: z.string(),
  amount: z.coerce.number().gt(0, { message: 'Tidak boleh nol' }),
  date: z.coerce.date(),
  note: z.string().optional(),
})

export type CashAdvance = z.infer<typeof CashAdvanceSchema>
export type CashAdvanceTransaction = z.infer<typeof CashAdvanceTransactionSchema>