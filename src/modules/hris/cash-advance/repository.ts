import { z } from 'zod'
import { cashAdvanceSchema } from './schema'
import db from '../../../lib/db'
import Message from '../../../utils/constant/message'
import { Prisma } from '@prisma/client'

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

export type FilterCash = {
  fullname?: string
  startDate?: Date
  endDate?: Date
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
    return await db.cashAdvance.update({
      data: {
        ...payload,
        requestDate: new Date(payload.requestDate).toISOString(),
      },
      where: {
        id,
      },
      select: {
        id: true,
      },
    })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.cashAdvance.delete({ where: { id } })
  }
  readAll = async () => {
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
        employeeId: true,
      },
    })
    return data
  }
  readById = async (id: number) => {
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
        employeeId: true,
      },
      where: { id },
    })
    return data
  }
  readByPagination = async (
    page: number = 1,
    limit: number = 10,
    filter?: FilterCash
  ) => {
    const skip = (page - 1) * limit
    let where: Prisma.CashAdvanceWhereInput = {}

    if (filter) {
      if (filter.fullname) {
        where = {
          employee: {
            OR: [
              { fullname: { contains: filter.fullname.toLowerCase() } },
              { fullname: { contains: filter.fullname.toUpperCase() } },
              { fullname: { contains: filter.fullname } },
            ],
          },
        }
      }

      if (filter.startDate && filter.endDate) {
        where = {
          ...where,
          requestDate: {
            gte: filter.startDate,
            lte: filter.endDate,
          },
        }
      }
    }

    const data = await db.cashAdvance.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        id: 'desc',
      },
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
        employeeId: true,
      },
    })

    const total = await db.cashAdvance.count({ where })
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    }
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
