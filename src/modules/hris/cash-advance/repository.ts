import { z } from 'zod'
import { cashAdvanceSchema } from './schema'
import db from '../../../lib/db'
import Message from '../../../utils/constant/message'

type cashAdvance = z.infer<typeof cashAdvanceSchema>

type MonthlyTotal = {
  month: string
  total: number
}

type ChartConfig = {
  total: {
    label: string
    color: string
  }
}
export default class CashAdvanceRepository {
  private messagge: Message = new Message('Kasbon')

  create = async (payload: cashAdvance) => {
    await db.cashAdvance.create({
      data: {
        ...payload,
        requestDate: new Date(payload.requestDate).toISOString(),
      },
    })
  }
  update = async (id: number, payload: cashAdvance) => {
    await this.isExist(id)
    await db.cashAdvance.update({
      data: {
        ...payload,
        requestDate: new Date(payload.requestDate).toISOString(),
      },
      where: {
        id,
      },
    })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.cashAdvance.delete({ where: { id } })
  }
  read = async (id?: number) => {
    if (!!id) {
      await this.isExist(id)
      const data = await db.cashAdvance.findUnique({
        select: {
          employee: {
            select: {
              id: true,
              fullname: true,
            },
          },
          amount: true,
          id: true,
          requestDate: true,
          description: true,
        },
        where: { id },
      })
      return data
    }
    const data = await db.cashAdvance.findMany({
      select: {
        employee: {
          select: {
            id: true,
            fullname: true,
          },
        },
        amount: true,
        id: true,
        requestDate: true,
        description: true,
      },
    })
    return data
  }
  readTotal = async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const totalAmount = await db.cashAdvance.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        requestDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    })

    return { total: totalAmount._sum.amount || 0 }
  }

  readTotalInYear = async (totalMonths: number = 12) => {
    const now = new Date()
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - (totalMonths - 1),
      1
    )
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const monthlyTotals = await db.cashAdvance.groupBy({
      by: ['requestDate'],
      _sum: {
        amount: true,
      },
      where: {
        requestDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]

    const monthlyMap = new Map<number, number>()

    monthlyTotals.forEach((item) => {
      const date = new Date(item.requestDate)
      const month = date.getMonth()
      const currentTotal = monthlyMap.get(month) || 0
      monthlyMap.set(month, currentTotal + (item._sum.amount?.toNumber() || 0))
    })

    const chartData: MonthlyTotal[] = []
    for (let i = 0; i < totalMonths; i++) {
      const monthIndex = (now.getMonth() - (totalMonths - 1) + i + 12) % 12
      chartData.push({
        month: monthNames[monthIndex],
        total: Math.round(monthlyMap.get(monthIndex) || 0),
      })
    }

    const chartConfig = {
      total: {
        label: 'Total',
        color: '#2A9D90',
      },
    } satisfies ChartConfig

    return {
      chartData,
      chartConfig,
    }
  }

  protected isExist = async (id: number) => {
    const data = await db.cashAdvance.findUnique({ where: { id } })
    if (!data) throw Error(this.messagge.notfound())
  }
}
