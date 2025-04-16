import { z } from 'zod'

export const CashAdvanceSchema = z.object({
  employeeId: z.string().uuid({ message: 'Pilih salah satu pegawai' }),
  amount: z.coerce.number().gt(0, { message: 'Tidak boleh nol' }),
  date: z.coerce.date(),
  note: z.string().optional().nullable(),
})

export type CashAdvance = z.infer<typeof CashAdvanceSchema>
