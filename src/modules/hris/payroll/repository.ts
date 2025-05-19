import { getPaginateParams } from '@/utils/params'
import { Prisma } from '@prisma/client'
import db from '@/lib/prisma'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { HttpStatusCode } from 'axios'
import { Payroll } from './schema'
import { checkStatusPeriod } from './helper'

type AllParams = {
  page?: number
  limit?: number
  search?: string
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
}

// Payroll
export const readAll = async ({
  search,
  limit,
  page,
  periodId,
  status,
}: AllParams & {
  periodId?: string
  status?: 'draft' | 'done'
}) => {
  const filter: Prisma.PayrollWhereInput[] = []

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

  if (status) {
    filter.push({ status })
  }

  if (periodId) {
    filter.push({ periodId })
  }

  const where: Prisma.PayrollWhereInput = {
    AND: filter,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.payroll.findMany({
      where,
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
      orderBy: {
        createdAt: 'asc',
      },
      where,
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
  return await db.payroll.findUnique({ where: { id } })
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
    },
  })

  await checkStatusPeriod(data.periodId)

  return data
}
