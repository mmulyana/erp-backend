import db from '@/lib/prisma'
import { PayrollPeriod } from './schema'
import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { HttpStatusCode } from 'axios'
import { PeriodStatus, Prisma } from '@prisma/client'

type AllParams = {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
}

export const isExist = async (id: string) => {
  const data = await db.payrollPeriod.findUnique({
    where: { id, deletedAt: null },
  })
  if (!data) throwError(Messages.notFound, HttpStatusCode.BadRequest)
}
export const create = async (
  payload: PayrollPeriod & { createdBy: string },
) => {
  return await db.$transaction(async (tx) => {
    const period = await tx.payrollPeriod.create({
      data: {
        name: payload.name,
        startDate: payload.startDate,
        endDate: payload.endDate,
        payType: payload.payType,
        status: payload.status,
      },
    })

    const employees = await tx.employee.findMany({
      where: {
        payType: payload.payType,
        deletedAt: null,
        active: true,
      },
      select: {
        id: true,
        salary: true,
        overtimeSalary: true,
      },
    })

    const payrolls: Prisma.PayrollCreateManyInput[] = employees.map((emp) => ({
      periodId: period.id,
      employeeId: emp.id,
      workDay: 0,
      overtimeHour: 0,
      salary: emp.salary ?? 0,
      overtimeSalary: emp.overtimeSalary ?? 0,
      createdBy: payload.createdBy,
      status: 'draft',
    }))

    await tx.payroll.createMany({
      data: payrolls,
    })

    return period
  })
}
export const update = async (id: string, payload: PayrollPeriod) => {
  const data = await db.payrollPeriod.update({
    where: { id },
    data: {
      name: payload.name,
    },
  })
  return data
}
export const destroy = async (id: string) => {
  const data = await db.payrollPeriod.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })

  const payrolls = await db.payroll.findMany({ where: { periodId: id } })
  if (payrolls.length > 0) {
    await db.payroll.updateMany({
      data: {
        deletedAt: new Date(),
      },
      where: {
        periodId: id,
      },
    })
  }

  return data
}

export const readAll = async ({
  search,
  limit,
  page,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  status,
  infinite = false,
}: AllParams & {
  sortBy?: 'createdAt' | 'startDate' | 'endDate'
  sortOrder?: 'asc' | 'desc'
  status?: 'processing' | 'closed'
  infinite?: boolean
}) => {
  const where: Prisma.PayrollPeriodWhereInput = {
    AND: [
      search
        ? {
            OR: [
              {
                name: { contains: search, mode: 'insensitive' },
              },
            ],
          }
        : {},
      status ? { status: status as PeriodStatus } : {},
      { deletedAt: null },
    ],
  }

  const orderBy: Prisma.PayrollPeriodOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  }

  const payrollSelectFields = {
    workDay: true,
    salary: true,
    overtimeHour: true,
    overtimeSalary: true,
    deduction: true,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.payrollPeriod.findMany({
      where,
      orderBy,
    })

    const withTotalSpending = await Promise.all(
      data.map(async (period) => {
        const payrolls = await db.payroll.findMany({
          where: {
            periodId: period.id,
            status: 'done',
            deletedAt: null,
          },
          select: payrollSelectFields,
        })

        const totalSpending = payrolls.reduce((sum, p) => {
          const baseSalary =
            period.payType === 'daily' ? p.workDay * p.salary : p.salary
          return (
            sum + baseSalary + p.overtimeHour * p.overtimeSalary - p.deduction
          )
        }, 0)

        return {
          ...period,
          totalSpending,
        }
      }),
    )

    return { data: withTotalSpending }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.payrollPeriod.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    db.payrollPeriod.count({ where }),
  ])

  const withTotalSpending = await Promise.all(
    data.map(async (period) => {
      const payrolls = await db.payroll.findMany({
        where: {
          periodId: period.id,
          status: 'done',
          deletedAt: null,
        },
        select: payrollSelectFields,
      })

      const totalSpending = payrolls.reduce((sum, p) => {
        const baseSalary =
          period.payType === 'daily' ? p.workDay * p.salary : p.salary
        return (
          sum + baseSalary + p.overtimeHour * p.overtimeSalary - p.deduction
        )
      }, 0)

      return {
        ...period,
        totalSpending,
      }
    }),
  )

  const total_pages = Math.ceil(total / limit)

  const hasNextPage = page * limit < total

  if (infinite) {
    return {
      data: withTotalSpending,
      nextPage: hasNextPage ? page + 1 : undefined,
    }
  }

  return {
    data: withTotalSpending,
    total,
    page,
    limit,
    total_pages,
  }
}

export const read = async (id: string) => {
  return await db.payrollPeriod.findUnique({
    where: { id },
  })
}
