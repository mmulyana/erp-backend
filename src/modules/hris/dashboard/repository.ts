import { addDays, endOfDay, startOfDay } from 'date-fns'
import { Prisma } from '@prisma/client'

import { getPaginateParams } from '@/utils/params'
import db from '@/lib/prisma'

type ExpiringParams = {
  day: number
  page?: number
  limit?: number
}

export const findTotalEmployee = async () => {
  const employees = await db.employee.findMany({
    where: {
      deletedAt: null,
    },
  })
  return {
    all: employees.length,
    active: employees.filter((i) => i.status).length,
    nonactive: employees.filter((i) => !i.status).length,
  }
}

export const findExpiringCertificates = async ({
  day,
  page,
  limit,
}: ExpiringParams) => {
  const today = startOfDay(new Date())
  const deadline = endOfDay(addDays(today, day))

  const where: Prisma.CertificateWhereInput = {
    expiryDate: {
      gte: today,
      lte: deadline,
    },
  }

  if (page === undefined || limit === undefined) {
    const data = await db.certificate.findMany({
      where,
      orderBy: { expiryDate: 'asc' },
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.certificate.findMany({
      where,
      orderBy: { expiryDate: 'asc' },
      skip,
      take,
    }),
    db.certificate.count({ where }),
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

export const findExpiringSafetyInduction = async ({
  day,
  page,
  limit,
}: ExpiringParams) => {
  const today = startOfDay(new Date())
  const deadline = endOfDay(addDays(today, day))

  const where: Prisma.EmployeeWhereInput = {
    safetyInductionDate: {
      gte: today,
      lte: deadline,
    },
  }

  if (page === undefined || limit === undefined) {
    const data = await db.employee.findMany({
      where,
      orderBy: { safetyInductionDate: 'asc' },
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.employee.findMany({
      where,
      orderBy: { safetyInductionDate: 'asc' },
      skip,
      take,
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

export const findEmployeePosition = async () => {
  const result = await db.employee.groupBy({
    by: ['position'],
    _count: {
      position: true,
    },
    orderBy: {
      position: 'asc',
    },
  })

  return result.map((item) => ({
    position: item.position,
    employee: item._count.position,
  }))
}

export const findEmployeeEducation = async () => {
  const result = await db.employee.groupBy({
    by: ['lastEducation'],
    _count: {
      lastEducation: true,
    },
    orderBy: {
      lastEducation: 'asc',
    },
  })

  return result.map((item) => ({
    name: item.lastEducation,
    total: item._count.lastEducation,
  }))
}