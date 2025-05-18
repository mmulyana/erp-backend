import db from '@/lib/prisma'
import { Messages } from '@/utils/constant'
import { throwError } from '@/utils/error-handler'
import { HttpStatusCode } from 'axios'
import { PayrollPeriod } from './schema'
import { Prisma } from '@prisma/client'
import { getPaginateParams } from '@/utils/params'

type AllParams = {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
}

// Period
export const isPeriodExist = async (id: string) => {
  const data = await db.payrollPeriod.findUnique({
    where: { id, deletedAt: null },
  })
  if (!data) throwError(Messages.notFound, HttpStatusCode.BadRequest)
}
export const createPeriod = async (
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
export const updatePeriod = async (id: string, payload: PayrollPeriod) => {
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
export const destroyPeriod = async (id: string, payload: PayrollPeriod) => {
  const data = await db.payrollPeriod.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  })
  return data
}
export const findAllPeriod = async ({
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
    return { data }
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

  const total_pages = Math.ceil(total / limit)

  return {
    data,
    total,
    page,
    limit,
    total_pages,
  }
}
export const findOnePeriod = async (id: string) => {
  return await db.payrollPeriod.findUnique({
    where: { id },
  })
}

// Payroll
export const findAll = async ({
  search,
  limit,
  page,
  periodId,
  status,
}: AllParams & {
  periodId?: string
  status?: 'draft' | 'done'
}) => {
  const payrollFilters: Prisma.PayrollWhereInput[] = []

  if (search) {
    payrollFilters.push({
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
    payrollFilters.push({ status })
  }

  if (periodId) {
    payrollFilters.push({ periodId })
  }

  const where: Prisma.PayrollWhereInput = {
    AND: payrollFilters,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.payroll.findMany({
      where,
    })
    return { data }
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
    }),
    db.payroll.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)

  return {
    data,
    total,
    page,
    limit,
    total_pages,
  }
}

export const findOne = async ({ id }: { id: string }) => {
  return await db.payroll.findUnique({ where: { id } })
}
