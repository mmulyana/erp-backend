import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { convertToWIB, generateDateRange } from '@/utils/generate-date-range'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Attendance } from './schema'
import { getPaginateParams } from '@/utils/params'

export const isExist = async (id: string) => {
  const data = await db.attendance.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const create = async (data: Attendance & { createdBy: string }) => {
  const existing = await db.attendance.findMany({
    where: {
      employeeId: data.employeeId,
      date: new Date(data.date),
    },
  })
  if (existing.length > 0) {
    return throwError(
      `Data presensi untuk tanggal ini sudah tercatat sebelumnya`,
      HttpStatusCode.BadRequest,
    )
  }

  return await db.attendance.create({
    data: {
      date: new Date(data.date),
      employeeId: data.employeeId,
      type: data.type,
      createdBy: data.createdBy,
    },
  })
}

export const update = async (payload: Attendance & { createdBy: string }) => {
  if (!payload.employeeId || !payload.date) {
    throw new Error('employeeId dan date wajib ada')
  }

  const existing = await db.attendance.findFirst({
    where: {
      employeeId: payload.employeeId,
      date: new Date(payload.date),
    },
  })

  if (existing) {
    return await db.attendance.update({
      where: { id: existing.id },
      data: {
        type: payload.type,
      },
    })
  } else {
    return await db.attendance.create({
      data: {
        employeeId: payload.employeeId,
        date: new Date(payload.date),
        type: payload.type,
        createdBy: payload.createdBy,
      },
    })
  }
}

// export const destroy = async (id: string) => {
//   await isExist(id)
//   await db.attendance.delete({ where: { id } })
// }

type ReadAllParams = {
  startDate: Date
  search?: string
  position?: string
  page?: number
  limit?: number
}
export const readAll = async ({
  startDate,
  search,
  position,
  page,
  limit,
}: ReadAllParams) => {
  const whereEmployee: Prisma.EmployeeWhereInput = {
    deletedAt: null,
    fullname: search ? { contains: search, mode: 'insensitive' } : undefined,
    position: position || undefined,
    active: true,
  }

  if (page === undefined || limit === undefined) {
    const employees = await db.employee.findMany({
      where: whereEmployee,
      select: {
        id: true,
        fullname: true,
        position: true,
        attendances: {
          where: {
            date: {
              gte: startDate,
              lte: startDate,
            },
          },
          select: {
            type: true,
          },
        },
      },
    })

    const data = employees.map((employee) => {
      const attendance = employee.attendances[0]
      return {
        employeeId: employee.id,
        fullname: employee.fullname,
        position: employee.position ?? '-',
        status: attendance?.type ?? null,
      }
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [employees, total] = await Promise.all([
    db.employee.findMany({
      where: whereEmployee,
      skip,
      take,
      orderBy: {
        fullname: 'asc',
      },
      select: {
        id: true,
        fullname: true,
        position: true,
        attendances: {
          where: {
            date: {
              gte: startDate,
              lte: startDate,
            },
          },
          select: {
            type: true,
          },
        },
      },
    }),
    db.employee.count({ where: whereEmployee }),
  ])

  const data = employees.map((employee) => {
    const attendance = employee.attendances[0]
    return {
      employeeId: employee.id,
      fullname: employee.fullname,
      position: employee.position ?? '-',
      status: attendance?.type ?? null,
    }
  })

  const total_pages = Math.ceil(total / limit)

  return {
    data,
    total,
    page,
    limit,
    total_pages,
  }
}

export const totalPerDay = async (date: Date) => {
  const whereEmployee: Prisma.EmployeeWhereInput = {
    deletedAt: null,
    active: true,
  }

  const employees = await db.employee.findMany({
    where: whereEmployee,
    select: {
      id: true,
      fullname: true,
      position: true,
      attendances: {
        where: {
          date: {
            gte: date,
            lte: date,
          },
        },
        select: {
          type: true,
        },
      },
    },
  })

  const data = employees.map((employee) => {
    const attendance = employee.attendances[0]
    return {
      status: attendance?.type ?? null,
    }
  })

  const total_presence = data.filter((i) => i.status === 'presence').length
  const total_absent = data.filter((i) => i.status === 'absent').length
  const total_notYet = data.filter((i) => !i.status).length

  return {
    total_presence,
    total_absent,
    total_notYet,
  }
}
