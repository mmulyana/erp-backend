import { z } from 'zod'

export const OvertimeSchema = z.object({
  employeeId: z.string().uuid("Tidak boleh kosong"),
  date: z.coerce.date(),
  totalHour: z.number().min(1, 'Tidak boleh nol'),
  note: z.string().optional(),
  projectId: z.string().nullable().optional(),
})

export type Overtime = z.infer<typeof OvertimeSchema>
