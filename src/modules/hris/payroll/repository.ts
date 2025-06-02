import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { HttpStatusCode } from 'axios'

import { PaginationParams } from '@/types'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { Prisma } from '@prisma/client'
import db from '@/lib/prisma'

import { checkStatusPeriod } from './helper'
import { Payroll } from './schema'

type AllParams = PaginationParams & {
  startDate?: string
  endDate?: string
}

const select: Prisma.PayrollSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deduction: true,
  employee: {
    select: {
      id: true,
      fullname: true,
      position: true,
    },
  },
  employeeId: true,
  note: true,
  overtimeHour: true,
  overtimeSalary: true,
  paymentType: true,
  periodId: true,
  salary: true,
  status: true,
  workDay: true,
  doneAt: true,
  period: {
    select: {
      id: true,
      name: true,
    },
  },
}

// Payroll
export const readAll = async ({
  search,
  limit,
  page,
  periodId,
  status,
  sortBy = 'createdAt',
  sortOrder = 'asc',
}: AllParams & {
  periodId?: string
  status?: 'draft' | 'done'
  sortBy?: 'createdAt' | 'doneAt'
  sortOrder?: 'asc' | 'desc'
}) => {
  const filter: Prisma.PayrollWhereInput[] = [{ deletedAt: null }]

  if (search) {
    filter.push({
      OR: [
        {
          employee: {
            fullname: { contains: search, mode: 'insensitive' },
          },
        },
      ],
    })
  }

  if (status) filter.push({ status })
  if (periodId) filter.push({ periodId })

  const where: Prisma.PayrollWhereInput = {
    AND: filter,
  }

  const orderBy: Prisma.PayrollOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.payroll.findMany({
      where,
      orderBy,
      select,
    })

    const withSalary = data.map((i) => ({
      ...i,
      salary:
        i.workDay * i.salary + i.overtimeHour * i.overtimeSalary - i.deduction,
    }))

    return { data: withSalary }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.payroll.findMany({
      where,
      orderBy,
      skip,
      take,
      select,
    }),
    db.payroll.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)

  const withSalary = data.map((i) => ({
    ...i,
    salary:
      i.workDay * i.salary + i.overtimeHour * i.overtimeSalary - i.deduction,
  }))

  return {
    data: withSalary,
    total,
    page,
    limit,
    total_pages,
  }
}

export const readOne = async (id: string) => {
  return await db.payroll.findUnique({ where: { id }, select })
}

export const isExist = async (id: string) => {
  const data = await db.payroll.findUnique({ where: { id, deletedAt: null } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const update = async (id: string, payload: Payroll) => {
  const data = await db.payroll.update({
    where: { id },
    data: {
      deduction: payload.deduction,
      note: payload.note,
      overtimeHour: payload.overtimeHour,
      workDay: payload.workDay,
      salary: payload.salary,
      overtimeSalary: payload.overtimeSalary,
      paymentType: payload.paymentType,
      status: payload.status,
      doneAt: payload.doneAt,
    },
  })

  await checkStatusPeriod(data.periodId)

  return data
}

export const findTotalAmount = async ({
  periodId,
  monthIndex,
  year = new Date().getFullYear(),
}: {
  periodId?: string
  monthIndex?: number
  year?: number
}) => {
  const where: Prisma.PayrollWhereInput = {
    status: 'done',
    deletedAt: null,
    doneAt: {
      not: null,
    },
  }

  if (periodId) {
    where.periodId = periodId
    const payrolls = await db.payroll.findMany({
      where,
      select: {
        salary: true,
        overtimeSalary: true,
        deduction: true,
        workDay: true,
        overtimeHour: true,
      },
    })

    const totalAmount = payrolls.reduce((sum, p) => {
      return (
        sum +
        p.salary * p.workDay +
        p.overtimeSalary * p.overtimeHour -
        p.deduction
      )
    }, 0)

    return { total: totalAmount }
  }

  if (typeof monthIndex === 'number') {
    const start = startOfMonth(new Date(year, monthIndex))
    const end = endOfMonth(start)

    const prevStart = startOfMonth(subMonths(start, 1))
    const prevEnd = endOfMonth(prevStart)

    const [currentPayrolls, prevPayrolls] = await Promise.all([
      db.payroll.findMany({
        where: {
          ...where,
          createdAt: { gte: start, lte: end },
        },
        select: {
          salary: true,
          overtimeSalary: true,
          deduction: true,
          workDay: true,
          overtimeHour: true,
        },
      }),
      db.payroll.findMany({
        where: {
          ...where,
          createdAt: { gte: prevStart, lte: prevEnd },
        },
        select: {
          salary: true,
          overtimeSalary: true,
          deduction: true,
          workDay: true,
          overtimeHour: true,
        },
      }),
    ])

    const sum = (items: typeof currentPayrolls) =>
      items.reduce(
        (sum, p) =>
          sum +
          p.salary * p.workDay +
          p.overtimeSalary * p.overtimeHour -
          p.deduction,
        0,
      )

    const current = sum(currentPayrolls)
    const previous = sum(prevPayrolls)
    const percentage =
      previous === 0 ? 100 : ((current - previous) / previous) * 100

    return { total: current, percentage }
  }

  return { total: 0 }
}

export const findProgressByPeriodId = async (periodId: string) => {
  const result = await db.payroll.groupBy({
    by: ['status'],
    where: {
      periodId,
      deletedAt: null,
    },
    _count: {
      _all: true,
    },
  })

  const fillMap: Record<string, string> = {
    done: '#47AF97',
    draft: '#EAEAEB',
  }

  const labelMap: Record<string, string> = {
    done: 'Selesai',
    draft: 'Draft',
  }

  const chartData = result.map((item) => ({
    name: labelMap[item.status],
    total: item._count._all,
    fill: fillMap[item.status],
  }))

  return { data: chartData }
}
