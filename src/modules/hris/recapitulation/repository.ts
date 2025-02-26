import { convertToWIB, generateDateRange } from '@/utils/generate-date-range'
import { Prisma, Recap } from '@prisma/client'
import db from '@/lib/prisma'
import { throwError } from '@/utils/error-handler'
import { HttpStatusCode } from 'axios'
import { getPaginateParams } from '@/utils/params'

export const getReport = async (
  start_date: Date,
  end_date: Date,
  page: number = 1,
  limit: number = 40,
) => {
  const skip = (page - 1) * limit
  const wibStartDate = convertToWIB(start_date)
  const wibEndDate = convertToWIB(end_date)
  const dates = generateDateRange(wibStartDate, wibEndDate)

  const [employeesWithData, totalEmployees] = await Promise.all([
    db.employee.findMany({
      where: getEmployeeWhereClause(wibStartDate, wibEndDate),
      select: employeeSelectFields,
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    db.employee.count({
      where: getEmployeeWhereClause(wibStartDate, wibEndDate),
    }),
  ])

  const employeeData = await Promise.all(
    employeesWithData.map(processEmployeeData(wibStartDate, wibEndDate, dates)),
  )

  return {
    page,
    dates,
    data: employeeData,
    limit,
    total: totalEmployees,
    total_pages: Math.ceil(totalEmployees / limit),
  }
}

const getEmployeeWhereClause = (
  start: Date,
  end: Date,
): Prisma.EmployeeWhereInput => ({
  OR: [
    { AND: { status: true, deletedAt: null } },
    { attendances: { some: { date: { gte: start, lte: end } } } },
    { overtimes: { some: { date: { gte: start, lte: end } } } },
    { cashAdvances: { some: { date: { gte: start, lte: end } } } },
  ],
})

const employeeSelectFields = {
  id: true,
  fullname: true,
  basic_salary: true,
  overtime_salary: true,
  position: { select: { name: true } },
}

const processEmployeeData =
  (start: Date, end: Date, dates: string[]) => async (employee: any) => {
    const [attendance, overtime] = await Promise.all([
      db.attendance.findMany({
        where: { employeeId: employee.id, date: { gte: start, lte: end } },
        select: attendanceSelectFields,
        orderBy: { date: 'asc' },
      }),
      db.overtime.findMany({
        where: { employeeId: employee.id, date: { gte: start, lte: end } },
        select: overtimeSelectFields,
        orderBy: { date: 'asc' },
      }),
    ])

    const [attendanceMap, overtimeMap] = [
      createDateMap(attendance, 'date'),
      createDateMap(overtime, 'date'),
    ]

    const cashAdvances = await db.cashAdvance.aggregate({
      where: { employeeId: employee.id, date: { gte: start, lte: end } },
      _sum: { amount: true },
    })

    const totals = calculateTotals(
      employee,
      attendance,
      overtime,
      cashAdvances._sum.amount || 0,
    )

    return {
      employeeId: employee.id,
      fullname: employee.fullname,
      basic_salary: Number(employee.basic_salary) || 0,
      overtime_salary: Number(employee.overtime_salary) || 0,
      position: employee.position?.name || null,
      attendance: dates.map((date) => attendanceMap.get(date) || null),
      overtime: dates.map((date) => overtimeMap.get(date) || null),
      ...totals,
    }
  }

const attendanceSelectFields = {
  id: true,
  date: true,
  total_hour: true,
  type: true,
}

const overtimeSelectFields = {
  id: true,
  date: true,
  total_hour: true,
  description: true,
}

const createDateMap = (items: any[], dateField: string) =>
  new Map(
    items.map((item) => {
      const wibDate = convertToWIB(item[dateField])
      return [wibDate.toISOString(), { ...item, date: wibDate }]
    }),
  )

const calculateTotals = (
  employee: any,
  attendance: any[],
  overtime: any[],
  cashAdvance: number,
) => {
  const attendanceTotal = attendance.reduce(
    (sum, curr) => sum + curr.total_hour,
    0,
  )
  const overtimeTotal = overtime.reduce((sum, curr) => sum + curr.total_hour, 0)
  const attendanceFee = (employee.basic_salary || 0) * attendanceTotal
  const overtimeFee = (employee.overtime_salary || 0) * overtimeTotal
  const total = attendanceFee + overtimeFee - cashAdvance

  return {
    totalCashAdvace: cashAdvance,
    attendanceTotal,
    overtimeTotal,
    attendanceFee,
    overtimeFee,
    total,
  }
}

export const findOne = async (id: string) => {
  const data = await db.recap.findUnique({ where: { id } })
  return { data }
}

export const findAll = async (
  page?: number,
  limit?: number,
  search?: string,
  year?: number,
) => {
  let where: Prisma.RecapWhereInput = {
    OR: [search ? { name: { contains: search } } : {}],
  }

  if (year && !isNaN(year)) {
    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31)
    where = {
      ...where,
      AND: [
        { startDate: { gte: startOfYear, lte: endOfYear } },
        { endDate: { gte: startOfYear, lte: endOfYear } },
      ],
    }
  }

  if (page === undefined || limit === undefined) {
    const data = await db.recap.findMany({ where })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.recap.findMany({
      skip,
      take,
      where,
      orderBy: { id: 'desc' },
    }),
    db.recap.count({ where }),
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

export const create = async (payload: Recap) =>
  await db.recap.create({
    data: {
      name: payload.name,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
    },
  })

export const update = async (id: string, payload: Partial<Recap>) => {
  const updateData: Prisma.RecapUpdateInput = {
    ...payload,
    ...(payload.startDate && { start_date: new Date(payload.startDate) }),
    ...(payload.endDate && { end_date: new Date(payload.endDate) }),
  }

  return await db.recap.update({
    where: { id },
    data: updateData,
  })
}

export const destroy = async (id: string) => {
  await db.recap.delete({ where: { id } })
}

export const isExist = async (id: string) => {
  const data = await db.recap.findUnique({ where: { id } })
  if (!data) {
    return throwError('Rekapitulasi tidak ditemukan', HttpStatusCode.BadRequest)
  }
}
