import db from '@/lib/prisma'
import { PayrollStatus, PeriodStatus } from '@prisma/client'

export const checkStatusPeriod = async (id) => {
  const payrolls = await db.payroll.findMany({
    where: {
      periodId: id,
    },
  })
  const isAnyDraft = payrolls.some((i) => i.status === PayrollStatus.draft)
  if (isAnyDraft) {
    return
  }

  await db.payrollPeriod.update({
    where: { id },
    data: {
      status: PeriodStatus.done,
    },
  })
}
