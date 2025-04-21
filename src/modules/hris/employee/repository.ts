import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'
import {
  addMonths,
  differenceInCalendarMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  getDate,
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
    status: true,
    safetyInductionDate: true,
  }
  return await db.employee.findUnique({ where: { id }, select })
}

export const readAll = async (
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
    status: true,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.employee.findMany({
      where,
      select,
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
      orderBy: {
        createdAt: 'desc',
      },
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
    status: true,
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
  startDate,
  endDate,
}: {
  employeeId: string
  startDate: Date
  endDate: Date
}) => {
  const start = startOfDay(new Date(startDate))
  const end = endOfDay(new Date(endDate))

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

  // gruping per bulan
  const totalMonths = differenceInCalendarMonths(end, start) + 1

  const data = Array.from({ length: totalMonths }, (_, i) => {
    const currentMonth = addMonths(start, i)
    const month = currentMonth.getMonth()
    const year = currentMonth.getFullYear()

    const presence = attendances
      .filter(
        (att) =>
          att.type === 'presence' &&
          att.date.getFullYear() === year &&
          att.date.getMonth() === month,
      )
      .map((att) => getDate(att.date))

    return { presence }
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
