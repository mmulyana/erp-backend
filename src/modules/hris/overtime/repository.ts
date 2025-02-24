import db from '@/lib/prisma'
import { Overtime } from './schema'
import { throwError } from '@/utils/error-handler'
import { HttpStatusCode } from 'axios'
import { Messages } from '@/utils/constant'
import { Prisma } from '@prisma/client'
import { getPaginateParams } from '@/utils/params'

type Payload = Overtime & { createdBy: string }

export const create = async (payload: Payload) => {
  const existing = await db.overtime.findMany({
    where: {
      employeeId: payload.employeeId,
      date: new Date(payload.date),
    },
  })
  if (existing.length > 0) {
    return throwError(
      `Data lemburan untuk tanggal ${payload.date} sudah tercatat sebelumnya`,
      HttpStatusCode.BadRequest,
    )
  }

  return await db.overtime.create({
    data: {
      employeeId: payload.employeeId,
      totalHour: payload.totalHour,
      createdBy: payload.createdBy,
      note: payload.note,
      date: new Date(payload.date),
    },
  })
}

export const update = async (id: string, payload: Payload) => {
  await db.overtime.update({
    data: {
      employeeId: payload.employeeId,
      totalHour: payload.totalHour,
      createdBy: payload.createdBy,
      note: payload.note,
      ...(payload.date ? { date: new Date(payload.date) } : undefined),
    },
    where: { id },
  })
}

export const destroy = async (id: string) => {
  await db.overtime.delete({ where: { id } })
}

export const findAll = async (
  page?: number,
  limit?: number,
  search?: string,
  positionId?: string,
  startDate?: Date,
) => {
  const where: Prisma.OvertimeWhereInput = {
    date: startDate,
    employee: {
      AND: [
        positionId ? { positionId } : {},
        search
          ? {
              OR: [{ fullname: { contains: search } }],
            }
          : {},
      ],
    },
  }
  const select: Prisma.OvertimeSelect = {
    id: true,
    note: true,
    date: true,
    totalHour: true,
    employee: {
      select: {
        fullname: true,
        position: {
          select: {
            name: true,
          },
        },
      },
    },
  }

  if (page === undefined || limit === undefined) {
    const data = await db.overtime.findMany({ where, select })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.overtime.findMany({
      skip,
      take,
      where,
      select,
      orderBy: {},
    }),
    db.overtime.count({ where }),
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

export const findOne = async (id: string) => {
  const select: Prisma.OvertimeSelect = {
    id: true,
    note: true,
    date: true,
    totalHour: true,
    employee: {
      select: {
        fullname: true,
        position: {
          select: {
            name: true,
          },
        },
      },
    },
  }

  const data = await db.overtime.findUnique({ where: { id }, select })
  return { data }
}

export const isExist = async (id: string) => {
  const data = await db.overtime.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}
