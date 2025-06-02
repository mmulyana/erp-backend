import {
  addDays,
  addYears,
  differenceInCalendarDays,
  endOfDay,
  startOfDay,
} from 'date-fns'
import { Prisma } from '@prisma/client'

import { getPaginateParams } from '@/utils/params'
import db from '@/lib/prisma'
import { PaginationParams } from '@/types'

type ExpiringParams = PaginationParams & {
  day: number
}

export const findTotalEmployee = async () => {
  const employees = await db.employee.findMany({
    where: {
      deletedAt: null,
    },
  })

  const data = {
    all: employees.length,
    active: employees.filter((i) => i.active).length,
    nonactive: employees.filter((i) => !i.active).length,
  }
  return {
    data,
  }
}

export const findExpiringCertificates = async ({
  day,
  page,
  limit,
}: ExpiringParams) => {
  const today = startOfDay(new Date())
  const deadline = endOfDay(addDays(today, day))

  const include: Prisma.CertificateInclude = {
    employee: {
      select: {
        id: true,
        fullname: true,
        position: true,
        photoUrl: true,
      },
    },
  }

  const where: Prisma.CertificateWhereInput = {
    expiryDate: {
      lte: deadline,
    },
  }
  // console.log('day', day)
  // console.log('where', where)

  if (page === undefined || limit === undefined) {
    const rawData = await db.certificate.findMany({
      include,
      where,
      orderBy: { expiryDate: 'asc' },
    })

    const data = rawData.map((item) => ({
      ...item,
      expireUntil: differenceInCalendarDays(new Date(item.expiryDate), today),
    }))
    // console.log('data', data)
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [rawData, total] = await Promise.all([
    db.certificate.findMany({
      include,
      where,
      orderBy: { expiryDate: 'asc' },
      skip,
      take,
    }),
    db.certificate.count({ where }),
  ])

  const data = rawData.map((item) => ({
    ...item,
    expireUntil: differenceInCalendarDays(new Date(item.expiryDate), today),
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

export const findExpiringSafetyInduction = async ({
  day,
  page,
  limit,
}: ExpiringParams) => {
  const today = startOfDay(new Date())
  const deadline = endOfDay(addDays(today, day))
  const maxDate = addYears(deadline, -1)

  const where: Prisma.EmployeeWhereInput = {
    safetyInductionDate: {
      lte: maxDate,
    },
  }

  const select: Prisma.EmployeeSelect = {
    id: true,
    fullname: true,
    position: true,
    safetyInductionDate: true,
    photoUrl: true,
  }

  if (page === undefined || limit === undefined) {
    const rawData = await db.employee.findMany({
      where,
      select,
      orderBy: { safetyInductionDate: 'asc' },
    })

    const data = rawData.map((emp) => {
      const expiryDate = addYears(emp.safetyInductionDate!, 1)
      const expireUntil = differenceInCalendarDays(expiryDate, today)

      return {
        ...emp,
        expiryDate,
        expireUntil,
      }
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [rawData, total] = await Promise.all([
    db.employee.findMany({
      where,
      select,
      orderBy: { safetyInductionDate: 'asc' },
      skip,
      take,
    }),
    db.employee.count({ where }),
  ])

  const data = rawData.map((emp) => {
    const expiryDate = addYears(emp.safetyInductionDate!, 1)
    const expireUntil = differenceInCalendarDays(expiryDate, today)

    return {
      ...emp,
      expiryDate,
      expireUntil,
    }
  })

  return {
    data,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  }
}
