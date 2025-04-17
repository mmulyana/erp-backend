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
      `Anda hanya dapat memasukan data lembur pegawai satu kali pada tanggal ${new Date(payload.date).getDate()}`,
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

type findAllParams = {
  page?: number
  limit?: number
  search?: string
  startDate?: Date
}
export const findAll = async ({
  page,
  limit,
  search,
  startDate,
}: findAllParams) => {
  const where: Prisma.OvertimeWhereInput = {
    date: startDate,
    employee: {
      // deletedAt: null,
      AND: [
        search
          ? {
              OR: [{ fullname: { contains: search, mode: 'insensitive' } }],
            }
          : {},
      ],
    },
  }

  const select: Prisma.OvertimeSelect = {
    id: true,
    totalHour: true,
    note: true,
    employee: {
      select: {
        fullname: true,
        position: true,
        id: true,
      },
    },
  }

  if (page === undefined || limit === undefined) {
    const rawData = await db.overtime.findMany({
      where,
      select,
      orderBy: {
        createdAt: 'asc',
      },
    })

    const data = rawData.map((item) => ({
      id: item.id,
      employeeId: item.employeeId,
      fullname: item.employee.fullname,
      position: item.employee.position ?? '-',
      totalHour: item.totalHour,
      note: item.note ?? '',
    }))

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [rawData, total] = await Promise.all([
    db.overtime.findMany({
      skip,
      take,
      where,
      select,
      orderBy: {
        createdAt: 'asc',
      },
    }),
    db.overtime.count({ where }),
  ])

  const data = rawData.map((item) => ({
    id: item.id,
    fullname: item.employee.fullname,
    position: item.employee.position ?? '-',
    totalHour: item.totalHour,
    note: item.note ?? '',
  }))

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
        position: true,
        id: true,
      },
    },
  }

  return await db.overtime.findUnique({ where: { id }, select })
}

export const isExist = async (id: string) => {
  const data = await db.overtime.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const totalPerDay = async (date: Date) => {
  const overtimes = await db.overtime.findMany({
    where: {
      date: {
        gte: date,
        lte: date,
      },
    },
  })

  return {
    total: overtimes.length,
  }
}
