import { Prisma } from '@prisma/client'
import { Recap } from './schema'
import db from '../../../lib/db'
import {
  convertToWIB,
  generateDateRange,
} from '../../../utils/generate-date-range'

interface FilterRecap {
  name?: string
  start_date?: Date
  end_date?: Date
  year?: number
}

export default class RecapRepository {
  getReport = async (
    start_date: Date,
    end_date: Date,
    page: number = 1,
    limit: number = 40
  ) => {
    const skip = (page - 1) * limit
    const wibStartDate = convertToWIB(start_date)
    const wibEndDate = convertToWIB(end_date)
    const dates = generateDateRange(wibStartDate, wibEndDate)

    // Get employees with data in the date range using subqueries
    const employeesWithData = await db.employee.findMany({
      where: {
        pay_type: 'daily',
        OR: [
          {
            // Active and not hidden
            AND: {
              status: true,
              isHidden: false,
            },
          },
          {
            // Has attendance
            attendances: {
              some: {
                date: {
                  gte: wibStartDate,
                  lte: wibEndDate,
                },
              },
            },
          },
          {
            // Has overtime
            overtime: {
              some: {
                date: {
                  gte: wibStartDate,
                  lte: wibEndDate,
                },
              },
            },
          },
          {
            // Has cash advance
            cashAdvances: {
              some: {
                requestDate: {
                  gte: wibStartDate,
                  lte: wibEndDate,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        fullname: true,
        basic_salary: true,
        overtime_salary: true,
        position: {
          select: {
            name: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        id: 'asc',
      },
    })

    // Get total count with same conditions
    const totalEmployees = await db.employee.count({
      where: {
        pay_type: 'daily',
        OR: [
          {
            AND: {
              status: true,
              isHidden: false,
            },
          },
          {
            attendances: {
              some: {
                date: {
                  gte: wibStartDate,
                  lte: wibEndDate,
                },
              },
            },
          },
          {
            overtime: {
              some: {
                date: {
                  gte: wibStartDate,
                  lte: wibEndDate,
                },
              },
            },
          },
          {
            cashAdvances: {
              some: {
                requestDate: {
                  gte: wibStartDate,
                  lte: wibEndDate,
                },
              },
            },
          },
        ],
      },
    })

    const employeeData = await Promise.all(
      employeesWithData.map(async (employee) => {
        const [attendance, overtime] = await Promise.all([
          db.attendance.findMany({
            where: {
              employeeId: employee.id,
              date: {
                gte: wibStartDate,
                lte: wibEndDate,
              },
            },
            select: {
              id: true,
              date: true,
              total_hour: true,
              type: true,
            },
            orderBy: {
              date: 'asc',
            },
          }),
          db.overtime.findMany({
            where: {
              employeeId: employee.id,
              date: {
                gte: wibStartDate,
                lte: wibEndDate,
              },
            },
            select: {
              id: true,
              date: true,
              total_hour: true,
              description: true,
            },
            orderBy: {
              date: 'asc',
            },
          }),
        ])

        const attendanceMap = new Map(
          attendance.map((a) => {
            const wibDate = convertToWIB(a.date)
            return [wibDate.toISOString(), { ...a, date: wibDate }]
          })
        )

        const attendanceTotal = attendance.reduce(
          (prev, curr) => prev + curr.total_hour,
          0
        )
        const overtimeTotal = overtime.reduce(
          (prev, curr) => prev + curr.total_hour,
          0
        )

        const overtimeMap = new Map(
          overtime.map((o) => {
            const wibDate = convertToWIB(o.date)
            return [wibDate.toISOString(), { ...o, date: wibDate }]
          })
        )

        const cashAdvances = await db.cashAdvance.aggregate({
          where: {
            employeeId: employee.id,
            requestDate: {
              gte: wibStartDate,
              lte: wibEndDate,
            },
          },
          _sum: {
            amount: true,
          },
        })
        const totalCashAdvace = Number(cashAdvances._sum.amount) || 0

        const attendanceFee = employee.basic_salary
          ? attendanceTotal * Number(employee.basic_salary)
          : 0
        const overtimeFee = employee.overtime_salary
          ? overtimeTotal * Number(employee.overtime_salary)
          : 0

        const total = attendanceFee + overtimeFee - totalCashAdvace

        return {
          employeeId: employee.id,
          fullname: employee.fullname,
          basic_salary: Number(employee.basic_salary) || 0,
          overtime_salary: Number(employee.overtime_salary) || 0,
          position: employee.position?.name || null,
          attendance: dates.map((date) => attendanceMap.get(date) || null),
          overtime: dates.map((date) => overtimeMap.get(date) || null),
          totalCashAdvace,
          attendanceTotal,
          overtimeTotal,
          attendanceFee,
          overtimeFee,
          total,
        }
      })
    )

    return {
      page,
      dates,
      data: employeeData,
      limit: limit,
      total: totalEmployees,
      total_pages: Math.ceil(totalEmployees / limit),
    }
  }

  findById = async (id: number) => {
    return await db.recap.findUnique({
      where: { id },
    })
  }

  findAll = async () => {
    return await db.recap.findMany()
  }

  findByPagination = async (
    page: number = 1,
    limit: number = 10,
    filter?: FilterRecap
  ) => {
    const skip = (page - 1) * limit
    let where: Prisma.RecapWhereInput = {}

    if (filter) {
      if (filter.name) {
        where = {
          ...where,
          OR: [
            { name: { contains: filter.name.toLowerCase() } },
            { name: { contains: filter.name.toUpperCase() } },
            { name: { contains: filter.name } },
          ],
        }
      }

      if (filter.year && !isNaN(filter.year)) {
        const startOfYear = new Date(filter.year, 0, 1)
        const endOfYear = new Date(filter.year, 11, 31)

        where = {
          ...where,
          AND: [
            {
              start_date: {
                gte: startOfYear,
                lte: endOfYear,
              },
            },
            {
              end_date: {
                gte: startOfYear,
                lte: endOfYear,
              },
            },
          ],
        }
      }
    }

    const data = await db.recap.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        id: 'desc',
      },
    })

    const total = await db.recap.count({ where })
    const total_pages = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      total_pages,
    }
  }

  create = async (payload: Recap) => {
    return await db.recap.create({
      data: {
        name: payload.name,
        start_date: new Date(payload.start_date),
        end_date: new Date(payload.end_date),
      },
    })
  }

  update = async (id: number, payload: Partial<Recap>) => {
    const data: Prisma.RecapUpdateInput = { ...payload }

    if (payload.start_date) {
      data.start_date = new Date(payload.start_date)
    }
    if (payload.end_date) {
      data.end_date = new Date(payload.end_date)
    }
    return await db.recap.update({
      where: { id },
      data,
    })
  }

  delete = async (id: number) => {
    return await db.recap.delete({
      where: { id },
    })
  }
}
