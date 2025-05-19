import db from '@/lib/prisma'
import { PayrollPeriod } from './schema'
import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { HttpStatusCode } from 'axios'
import { Prisma } from '@prisma/client'

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
    console.log('employees', employees)

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
    where: { id, deletedAt: null },
    data: {
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
    },
  })
  return data
}
export const destroy = async (id: string, payload: PayrollPeriod) => {
  const data = await db.payrollPeriod.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  })
  return data
}

export const findAll = async ({
  search,
  startDate,
  endDate,
  limit,
  page,
}: AllParams) => {
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
      startDate && endDate
        ? {
            startDate: {
              gte: new Date(startDate),
            },
            endDate: {
              lte: new Date(endDate),
            },
          }
        : {},
      { deletedAt: null },
    ],
  }

  if (page === undefined || limit === undefined) {
    const data = await db.payrollPeriod.findMany({
      where,
    })

    const withTotalSpending = await Promise.all(
      data.map(async (period) => {
        const payrolls = await db.payroll.findMany({
          where: {
            periodId: period.id,
            status: 'done',
            deletedAt: null,
          },
          select: {
            workDay: true,
            salary: true,
            overtimeHour: true,
            overtimeSalary: true,
            deduction: true,
          },
        })

        const totalSpending = payrolls.reduce((sum, p) => {
          return (
            sum +
            (p.workDay * p.salary +
              p.overtimeHour * p.overtimeSalary -
              p.deduction)
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
      orderBy: {
        createdAt: 'desc',
      },
      where,
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
        select: {
          workDay: true,
          salary: true,
          overtimeHour: true,
          overtimeSalary: true,
          deduction: true,
        },
      })

      const totalSpending = payrolls.reduce((sum, p) => {
        return (
          sum +
          (p.workDay * p.salary +
            p.overtimeHour * p.overtimeSalary -
            p.deduction)
        )
      }, 0)

      return {
        ...period,
        totalSpending,
      }
    }),
  )

  const total_pages = Math.ceil(total / limit)

  return {
    data: withTotalSpending,
    total,
    page,
    limit,
    total_pages,
  }
}

export const findOne = async (id: string) => {
  return await db.payrollPeriod.findUnique({
    where: { id },
  })
}
