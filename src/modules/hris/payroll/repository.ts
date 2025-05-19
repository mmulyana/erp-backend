import { getPaginateParams } from '@/utils/params'
import { Prisma } from '@prisma/client'
import db from '@/lib/prisma'

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
      select,
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
