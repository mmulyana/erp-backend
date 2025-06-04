import { CashAdvanceStatus, Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'
import {
  addMonths,
  getYear,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  getDate,
  getMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { id as ind } from 'date-fns/locale'

import { isValidUUID } from '@/utils/is-valid-uuid'
import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { deleteFile } from '@/utils/file'
import db from '@/lib/prisma'

import { PaginationParams } from '@/types'

import { Certification, Employee } from './schema'

type Payload = Employee & {
  photoUrl?: string
  active?: boolean
  deletedAt?: string
}

export const isExist = async (id: string) => {
  const data = await db.employee.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const isCertifExist = async (id: string) => {
  if (!isValidUUID(id)) {
    throwError('ID tidak valid', HttpStatusCode.BadRequest)
  }

  const data = await db.certificate.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const create = async (data: Payload) => {
  return await db.employee.create({
    data: {
      fullname: data.fullname,
      position: data.position,
      photoUrl: data.photoUrl,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      joinedAt: data.joinedAt ? new Date(data.joinedAt) : undefined,
      lastEducation: data.lastEducation,
      salary: data.salary,
      overtimeSalary: data.overtimeSalary,
      address: data.address,
      phone: data.phone,
      payType: data.payType,
    },
  })
}

export const update = async (id: string, data: Payload) => {
  const exist = await db.employee.findUnique({ where: { id } })
  if (data.photoUrl && exist.photoUrl) {
    await deleteFile(exist.photoUrl)
  }

  return await db.employee.update({
    where: { id },
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      safetyInductionDate: data.safetyInductionDate
        ? new Date(data.safetyInductionDate)
        : undefined,
    },
  })
}

export const destroy = async (id: string) => {
  return await db.employee.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const read = async (id: string) => {
  const select: Prisma.EmployeeSelect = {
    id: true,
    fullname: true,
    active: true,
    address: true,
    phone: true,
    photoUrl: true,
    createdAt: true,
    updatedAt: true,
    joinedAt: true,
    lastEducation: true,
    position: true,
    birthDate: true,
    salary: true,
    overtimeSalary: true,
    safetyInductionDate: true,
    payType: true,
  }
  return await db.employee.findUnique({ where: { id }, select })
}

export const readAll = async ({
  active,
  limit,
  page,
  position,
  search,
  lastEdu,
  sortBy,
  sortOrder,
}: PaginationParams & {
  lastEdu?: string
  position?: string
  active?: boolean
  sortBy?: any
  sortOrder?: 'desc' | 'asc'
}) => {
  const where: Prisma.EmployeeWhereInput = {
    AND: [
      search
        ? {
            OR: [{ fullname: { contains: search, mode: 'insensitive' } }],
          }
        : {},

      typeof active === 'boolean' ? { active } : {},

      position
        ? {
            position: {
              contains: position,
              mode: 'insensitive',
            },
          }
        : {},

      lastEdu
        ? {
            lastEducation: {
              equals: lastEdu,
              mode: 'insensitive',
            },
          }
        : {},
    ],
  }

  const select: Prisma.EmployeeSelect = {
    id: true,
    fullname: true,
    active: true,
    address: true,
    phone: true,
    photoUrl: true,
    createdAt: true,
    updatedAt: true,
    joinedAt: true,
    lastEducation: true,
    position: true,
    birthDate: true,
    salary: true,
    overtimeSalary: true,
  }

  const orderBy: Prisma.EmployeeOrderByWithRelationInput = {
    [sortBy ?? 'createdAt']: sortOrder ?? 'asc',
  }

  if (page === undefined || limit === undefined) {
    const data = await db.employee.findMany({
      where,
      select,
      orderBy,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)
  const [data, total] = await Promise.all([
    db.employee.findMany({
      skip,
      take,
      where,
      select,
      orderBy,
    }),
    db.employee.count({ where }),
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

export const readAllInfinite = async (
  page?: number,
  limit?: number,
  search?: string,
  position?: string,
  active?: boolean,
) => {
  const where: Prisma.EmployeeWhereInput = {
    AND: [
      search
        ? {
            OR: [{ fullname: { contains: search } }],
          }
        : {},
      active !== undefined ? { active } : {},
      position !== undefined ? { position } : {},
    ].filter(Boolean),
  }

  const select: Prisma.EmployeeSelect = {
    id: true,
    fullname: true,
    active: true,
    address: true,
    phone: true,
    photoUrl: true,
    createdAt: true,
    updatedAt: true,
    joinedAt: true,
    lastEducation: true,
    position: true,
    birthDate: true,
    salary: true,
    overtimeSalary: true,
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.employee.findMany({
      skip,
      take,
      where,
      select,
      orderBy: {
        fullname: 'asc',
      },
    }),
    db.employee.count({ where }),
  ])

  const hasNextPage = page * limit < total

  return {
    data,
    nextPage: hasNextPage ? page + 1 : undefined,
  }
}

export const destroyPhoto = async (id: string) => {
  const data = await db.employee.findUnique({ where: { id } })
  if (data.photoUrl) {
    await deleteFile(data.photoUrl)
  }

  return await db.employee.update({
    where: { id },
    data: {
      photoUrl: null,
    },
  })
}

// CERTIFICATION
export const createCertificate = async (
  employeeId: string,
  payload: Certification & { fileUrl?: string },
) => {
  return await db.certificate.create({
    data: {
      employeeId,
      name: payload.name,
      fileUrl: payload.fileUrl,
      publisher: payload.publisher,
      issueDate: payload.issueDate,
      expiryDate: payload.expiryDate,
    },
  })
}

export const updateCertificate = async (
  id: string,
  payload: Certification & { fileUrl?: string; changeFile?: boolean },
) => {
  const data = await db.certificate.findUnique({ where: { id } })
  if (payload.changeFile && data.fileUrl) {
    await deleteFile(data.fileUrl)
  }

  return await db.certificate.update({
    where: { id },
    data: {
      name: payload.name,
      fileUrl: payload.fileUrl,
      publisher: payload.publisher,
      issueDate: payload.issueDate,
      expiryDate: payload.expiryDate,
    },
  })
}

export const destroyCertificate = async (id: string) => {
  await db.certificate.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}

export const findCertificates = async ({
  search,
  page,
  limit,
  id,
}: PaginationParams & { id: string }) => {
  const where: Prisma.CertificateWhereInput = {
    deletedAt: null,
    name: search ? { contains: search, mode: 'insensitive' } : undefined,
    employeeId: id,
  }

  const select: Prisma.CertificateSelect = {
    id: true,
    name: true,
    fileUrl: true,
    publisher: true,
    issueDate: true,
    expiryDate: true,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.certificate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select,
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.certificate.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select,
    }),
    db.certificate.count({ where }),
  ])

  return {
    data,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  }
}

export const findCertificate = async (id: string) => {
  await isCertifExist(id)

  return db.certificate.findUnique({
    where: { id },
    select: {
      expiryDate: true,
      issueDate: true,
      name: true,
      fileUrl: true,
      publisher: true,
      id: true,
    },
  })
}

// DATA
export const findAttendanceById = async ({
  employeeId,
  year,
  startMonth,
  endMonth,
}: {
  employeeId: string
  year: number
  startMonth: number // 0 - 11
  endMonth: number // 0 - 11
}) => {
  const start = startOfMonth(new Date(year, startMonth))
  const end = endOfMonth(new Date(year, endMonth))

  const attendances = await db.attendance.findMany({
    where: {
      deletedAt: null,
      employeeId,
      date: {
        gte: start,
        lte: end,
      },
    },
    select: {
      date: true,
      type: true,
    },
  })

  const totalMonths = endMonth - startMonth + 1

  const data = Array.from({ length: totalMonths }, (_, i) => {
    const current = addMonths(start, i)
    const month = getMonth(current)
    const year = getYear(current)

    const filtered = attendances.filter(
      (att) => att.date.getFullYear() === year && att.date.getMonth() === month,
    )

    return {
      month,
      year,
      presence: filtered
        .filter((att) => att.type === 'presence')
        .map((att) => getDate(att.date)),
      absent: filtered
        .filter((att) => att.type === 'absent')
        .map((att) => getDate(att.date)),
    }
  })

  const allDates = eachDayOfInterval({ start, end })
  const filledDates = attendances.map((a) => a.date.toDateString())

  const total = {
    presence: attendances.filter((a) => a.type === 'presence').length,
    absent: attendances.filter((a) => a.type === 'absent').length,
    notYet: allDates.filter((d) => !filledDates.includes(d.toDateString()))
      .length,
  }

  return { data, total }
}

export const findOvertimeById = async ({
  employeeId,
  startDate,
  endDate,
  page,
  limit,
  search,
}: {
  employeeId: string
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
  search?: string
}) => {
  const where: Prisma.OvertimeWhereInput = {
    deletedAt: null,
    employeeId,
    date:
      startDate || endDate
        ? {
            ...(startDate && { gte: startOfDay(new Date(startDate)) }),
            ...(endDate && { lte: endOfDay(new Date(endDate)) }),
          }
        : undefined,
    note: search ? { contains: search, mode: 'insensitive' } : undefined,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.overtime.findMany({
      where,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        totalHour: true,
        note: true,
        date: true,
      },
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.overtime.findMany({
      where,
      skip,
      take,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        totalHour: true,
        note: true,
        date: true,
      },
    }),
    db.overtime.count({ where }),
  ])

  return {
    data,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  }
}

export const findCashAdvancesById = async ({
  employeeId,
  search,
  page,
  limit,
}: {
  employeeId: string
  search?: string
  page?: number
  limit?: number
}) => {
  const where: Prisma.CashAdvanceWhereInput = {
    deletedAt: null,
    employeeId,
    note: search ? { contains: search, mode: 'insensitive' } : undefined,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.cashAdvance.findMany({
      where,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        amount: true,
        note: true,
        date: true,
      },
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.cashAdvance.findMany({
      where,
      skip,
      take,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        amount: true,
        note: true,
        date: true,
      },
    }),
    db.cashAdvance.count({ where }),
  ])

  return {
    data,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  }
}

export const findChartCashAdvancesById = async (employeeId: string) => {
  const now = new Date()

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(now, 5 - i)
    return {
      key: format(date, 'yyyy-MM'),
      label: format(date, 'LLLL', { locale: ind }),
      start: startOfMonth(date),
      end: endOfMonth(date),
    }
  })

  const advances = await db.cashAdvance.findMany({
    where: {
      deletedAt: null,
      employeeId,
      date: {
        gte: months[0].start,
        lte: months[5].end,
      },
    },
    select: {
      date: true,
      amount: true,
    },
  })

  // group dan jumlah amount per bulan
  const chartData = months.map(({ label, start, end }) => {
    const total = advances
      .filter((a) => a.date >= start && a.date <= end)
      .reduce((sum, curr) => sum + curr.amount, 0)

    return {
      month: label,
      total,
    }
  })

  return chartData
}

export const findTotalEmployee = async () => {
  const employees = await db.employee.groupBy({
    by: ['active'],
    where: {
      deletedAt: null,
    },
    _count: {
      id: true,
    },
  })

  const chartData = [
    {
      name: 'Aktif',
      total: employees.find((e) => e.active === true)?._count.id ?? 0,
      fill: '#475DEF',
    },
    {
      name: 'Nonaktif',
      total: employees.find((e) => e.active === false)?._count.id ?? 0,
      fill: '#D52B42',
    },
  ]

  return chartData
}

export const findLastEducation = async () => {
  const educationGroups = await db.employee.groupBy({
    by: ['lastEducation'],
    where: {
      deletedAt: null,
    },
    _count: {
      _all: true,
    },
  })

  const colorMap: Record<string, string> = {
    sd: '#D52B42',
    smp: '#475DEF',
    sma: '#27B5E9',
    d3: '#10B981',
    s1: '#6366F1',
    s2: '#EC4899',
    s3: '#F97316',
    default: '#6B7280',
  }

  const chartData = educationGroups.map((item) => ({
    name: item.lastEducation || 'Belum diisi',
    total: item._count._all,
    fill: colorMap[item.lastEducation ?? 'default'] ?? colorMap.default,
  }))

  return chartData
}

export const findSummaryById = async ({
  id,
  startDate,
  endDate,
}: {
  id: string
  startDate: Date
  endDate: Date
}) => {
  const [presences, absents] = await Promise.all([
    db.attendance.findMany({
      where: {
        employeeId: id,
        type: 'presence',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    db.attendance.findMany({
      where: {
        employeeId: id,
        type: 'absent',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ])

  const attendances = [...presences, ...absents].sort((a, b) =>
    a.date < b.date ? -1 : 1,
  )

  const overtimes = await db.overtime.findMany({
    where: {
      employeeId: id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  const rawCashAdvances = await db.cashAdvance.findMany({
    where: {
      employeeId: id,
      date: {
        gte: startDate,
        lte: endDate,
      },
      status: CashAdvanceStatus.notYetPaidOff,
      deletedAt: null,
    },
    include: {
      transactions: true,
    },
  })

  const cashAdvances = rawCashAdvances.map((ca) => {
    const paid = ca.transactions.reduce((sum, t) => sum + t.amount, 0)
    const remaining = ca.amount - paid
    return {
      ...ca,
      remaining,
    }
  })

  const total = {
    presence: presences.length,
    absent: absents.length,
    overtimes: overtimes.reduce((sum, i) => sum + i.totalHour, 0),
  }

  return {
    total,
    attendances,
    overtimes,
    cashAdvances,
  }
}

export const readProjectEmployee = async ({
  page,
  limit,
  search,
  employeeId,
  sortBy,
  sortOrder,
}: PaginationParams & {
  employeeId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) => {
  const where: Prisma.AssignedEmployeeWhereInput = {
    AND: [
      search
        ? {
            OR: [
              {
                project: {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {},
      employeeId ? { employeeId } : {},
      { deletedAt: null },
    ],
  }

  const orderBy: Prisma.AssignedEmployeeOrderByWithRelationInput = {
    [sortBy || 'createdAt']: sortOrder || 'desc',
  }

  const select: Prisma.AssignedEmployeeSelect = {
    id: true,
    createdAt: true,
    startDate: true,
    endDate: true,
    deletedAt: true,
    employee: {
      select: {
        id: true,
        fullname: true,
        photoUrl: true,
        position: true,
      },
    },
    project: {
      select: {
        id: true,
        name: true,
        status: true,
        priority: true,
      },
    },
  }

  if (page === undefined || limit === undefined) {
    const data = await db.assignedEmployee.findMany({
      where,
      select,
      orderBy,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)
  const [data, total] = await Promise.all([
    db.assignedEmployee.findMany({
      skip,
      take,
      where,
      select,
      orderBy,
    }),
    db.assignedEmployee.count({ where }),
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
