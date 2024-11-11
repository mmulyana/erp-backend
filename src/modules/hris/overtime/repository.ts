import { overtimeSchema } from './schema'
import db from '../../../lib/db'
import { z } from 'zod'

type payload = z.infer<typeof overtimeSchema>

type Filter = {
  fullname?: string
  positionId?: number
  startDate?: Date
}
export default class OvertimeRepository {
  create = async (payload: payload) => {
    const existing = await db.overtime.findMany({
      where: {
        employeeId: payload.employeeId,
        date: new Date(payload.date),
      },
    })
    if (existing.length > 0) {
      throw new Error(
        `Data lemburan untuk tanggal ${payload.date} sudah tercatat sebelumnya`
      )
    }

    return await db.overtime.create({
      data: {
        ...payload,
        date: new Date(payload.date),
      },
    })
  }
  update = async (id: number, payload: payload) => {
    await db.overtime.update({
      data: {
        ...payload,
        date: new Date(payload.date),
      },
      where: { id },
    })
  }
  delete = async (id: number) => {
    await db.overtime.delete({ where: { id } })
  }
  read = async ({
    search,
    positionId,
    startDate,
  }: {
    search?: string
    positionId?: number
    startDate: Date
  }) => {
    return await db.overtime.findMany({
      where: {
        date: startDate,
        employee: {
          AND: [
            positionId ? { positionId } : {},
            search
              ? {
                  OR: [
                    { fullname: { contains: search.toLowerCase() } },
                    { fullname: { contains: search.toUpperCase() } },
                    { fullname: { contains: search } },
                  ],
                }
              : {},
          ],
        },
      },
      select: {
        id: true,
        description: true,
        date: true,
        total_hour: true,
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
      },
    })
  }
  readByPagination = async (
    page: number = 1,
    limit: number = 10,
    filter: Filter
  ) => {
    const skip = (page - 1) * limit

    let where: any = {}

    if (filter) {
      if (filter.startDate) {
        where = {
          ...where,
          date: filter.startDate,
        }
      }

      if (filter.positionId) {
        where.employee.AND.push({ positionId: filter.positionId })
      }

      if (filter.fullname && filter.fullname.trim() !== '') {
        where.employee.AND.push({
          OR: [
            { fullname: { contains: filter.fullname.toLowerCase() } },
            { fullname: { contains: filter.fullname.toUpperCase() } },
            { fullname: { contains: filter.fullname } },
          ],
        })
      }
    }

    const data = await db.overtime.findMany({
      skip,
      take: limit,
      where,
      select: {
        id: true,
        description: true,
        date: true,
        total_hour: true,
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
      },
    })

    const total = await db.overtime.count({ where })
    const total_pages = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      total_pages,
    }
  }
  readOne = async (id: number) => {
    return await db.overtime.findUnique({ where: { id } })
  }
}
