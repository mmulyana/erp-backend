import { Prisma } from '@prisma/client'
import db from '../../../lib/db'
import { Recap } from './schema'

interface FilterRecap {
  name?: string
  start_date?: Date
  end_date?: Date
  year?: number
}

export default class RecapRepository {
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
      if (
        filter.name &&
        filter.name !== 'undefined' &&
        filter.name.trim() !== ''
      ) {
        where = {
          ...where,
          OR: [
            { name: { contains: filter.name.toLowerCase() } },
            { name: { contains: filter.name.toUpperCase() } },
            { name: { contains: filter.name } },
          ],
        }
      }

      if (filter.start_date) {
        where = {
          ...where,
          start_date: {
            gte: filter.start_date,
          },
        }
      }

      if (filter.end_date) {
        where = {
          ...where,
          end_date: {
            lte: filter.end_date,
          },
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
