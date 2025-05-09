import { HttpStatusCode } from 'axios'

import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

export const recalculateRemaining = async (cashAdvanceId: string) => {
  const cashAdvance = await db.cashAdvance.findUnique({
    where: { id: cashAdvanceId, deletedAt: null },
    select: { amount: true },
  })

  if (!cashAdvance) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }

  const transactions = await db.cashAdvanceTransaction.findMany({
    where: {
      cashAdvanceId,
      deletedAt: null,
    },
    orderBy: { createdAt: 'asc' },
  })

  let remaining = cashAdvance.amount

  for (const tx of transactions) {
    remaining -= tx.amount
    await db.cashAdvanceTransaction.update({
      where: { id: tx.id },
      data: { remaining },
    })
  }
}

export const updateStatus = async (
  cashAdvanceId: string,
  remaining: number,
) => {
  await db.cashAdvance.update({
    where: { id: cashAdvanceId },
    data: {
      status: remaining <= 0 ? 'paidOff' : 'notYetPaidOff',
    },
  })
}
