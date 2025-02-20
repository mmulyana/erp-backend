import { z } from 'zod'
import { PositionSchema } from './schema'
import db from 'src/lib/prisma'
import { Messages } from 'src/utils/constant'
import { HttpStatusCode } from 'axios'
import { throwError } from 'src/utils/error-handler'
import { Prisma } from '@prisma/client'
import { getPaginateParams } from '@/utils/params'

type Payload = z.infer<typeof PositionSchema>
type ChartDataItem = {
  position: string
  count: number
  fill: string | null
}
type ChartDataItem2 = {
  status: string
  count: number
  fill: string | null
}

type ChartConfig = {
  [key: string]: {
    label: string
  }
}

export const isExist = async (id: string) => {
  const data = await db.position.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const create = async (payload: Payload) => {
  await db.position.create({
    data: {
      name: payload.name,
      color: payload.color,
      description: payload.description,
    },
  })
}

export const update = async (id: string, payload: Payload) => {
  await isExist(id)
  await db.position.update({ data: payload, where: { id } })
}

export const destroy = async (positionId: string) => {
  await isExist(positionId)
  const hasEmployee = await db.employee.findMany({
    where: { positionId },
  })
  if (hasEmployee.length > 0) {
    await db.employee.updateMany({
      where: { positionId },
      data: {
        positionId: null,
      },
    })
  }
  await db.position.delete({ where: { id: positionId } })
}

export const read = async (id: string) => {
  await isExist(id)

  const data = await db.position.findUnique({
    where: { id },
    select: {
      description: true,
      name: true,
      color: true,
      _count: {
        select: {
          employees: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
  })

  return data
}

export const readAll = async (
  page?: number,
  limit?: number,
  search?: string,
) => {
  const where: Prisma.PositionWhereInput = {
    AND: [
      search
        ? {
            OR: [
              {
                name: { contains: search },
                description: { contains: search },
              },
            ],
          }
        : {},
    ],
  }

  const select: Prisma.PositionSelect = {
    id: true,
    description: true,
    color: true,
    _count: {
      select: {
        employees: {
          where: {
            deletedAt: null,
          },
        },
      },
    },
  }

  if (page === undefined || limit === undefined) {
    const data = await db.position.findMany({ where, select })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.position.findMany({
      skip,
      take,
      where,
      orderBy: { name: 'asc' },
      select,
    }),
    db.position.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)
  return {
    data,
    total,
    total_pages,
    page,
    limit,
  }
}

export const totalEmployeePerPosition = async () => {
  const data = await db.position.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      _count: {
        select: {
          employees: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
  })

  const chartData: ChartDataItem[] = data.map((item) => ({
    position: item.name.toLowerCase(),
    count: item._count.employees,
    fill: item.color,
  }))

  const chartConfig: ChartConfig = data.reduce<ChartConfig>((config, item) => {
    const positionKey = item.name.toLowerCase()
    config[positionKey] = {
      label: item.name,
    }
    return config
  }, {})

  return { chartData, chartConfig }
}

export const totalEmployeePerStatus = async () => {
  const employees = await db.employee.groupBy({
    by: ['status', 'deletedAt'],
    where: {
      deletedAt: null,
    },
    _count: {
      status: true,
    },
  })

  const data = employees.map((item) => ({
    status: item.status,
    count: item._count.status,
  }))
  const chartData: ChartDataItem2[] = data.map((item) => ({
    status: item.status ? 'active' : 'nonactive',
    count: item.count,
    fill: item.status ? '#2A9D90' : '#F4A462',
  }))

  const chartConfig: ChartConfig = data.reduce((config, item) => {
    config[item.status ? 'active' : 'nonactive'] = {
      label: item.status ? 'Aktif' : 'Nonaktif',
    }
    return config
  }, {} as ChartConfig)

  return { chartData, chartConfig }
}
