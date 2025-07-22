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

  const totalUsed = await db.cashAdvanceTransaction.aggregate({
    where: {
      cashAdvanceId,
      deletedAt: null,
    },
    _sum: {
      amount: true,
    },
  })

  const remaining = cashAdvance.amount - (totalUsed._sum.amount ?? 0)

  return remaining
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

export const checkRemaining = async (id: string, amount: number) => {
  const cashAdvance = await db.cashAdvance.findUnique({
    where: { id, deletedAt: null },
    select: { amount: true },
  })

  if (!cashAdvance) {
    return throwError('Gak ada bang', HttpStatusCode.BadRequest)
  }

  const totalUsed = await db.cashAdvanceTransaction.aggregate({
    where: { cashAdvanceId: id, deletedAt: null },
    _sum: {
      amount: true,
    },
  })

  const remaining = cashAdvance.amount - (totalUsed._sum.amount ?? 0)

  // console.log('remaining', remaining)
  // console.log('amount', amount)

  if (amount > remaining) {
    return throwError(
      `Jumlah uang sudah melebihi sisa pembayaran`,
      HttpStatusCode.BadRequest,
    )
  }

  return true
}
