import { Prisma } from '@prisma/client'
import db from '../../../lib/db'
import { Client } from './schema'

type ChartData = {
  client: string
  count: number
  fill?: string | null
}

type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

type FilterClient = {
  name?: string
  companyId?: number
}

export default class ClientRepository {
  create = async (payload: Client) => {
    await db.client.create({
      data: { ...payload, companyId: Number(payload.companyId) || null },
    })
  }
  update = async (id: number, payload: Client) => {
    return await db.client.update({
      data: { ...payload, companyId: Number(payload.companyId) || null },
      where: { id },
      select: { id: true },
    })
  }
  delete = async (id: number) => {
    await db.client.delete({ where: { id } })
  }
  read = async (filter?: FilterClient) => {
    let where: Prisma.ClientWhereInput = {}

    if (filter) {
      if (filter.name) {
        where = {
          OR: [
            { name: { contains: filter.name.toLowerCase() } },
            { name: { contains: filter.name.toUpperCase() } },
            { name: { contains: filter.name } },
          ],
        }
      }

      if (filter.companyId && !isNaN(filter.companyId)) {
        where.companyId = filter.companyId
      }
    }

    return await db.client.findMany({
      where,
      include: {
        company: true,
      },
    })
  }
  readByPagination = async (
    page: number = 1,
    limit: number = 10,
    filter?: FilterClient
  ) => {
    const skip = (page - 1) * limit
    let where: Prisma.ClientWhereInput = {}

    if (filter) {
      if (filter.name) {
        where = {
          OR: [
            { name: { contains: filter.name.toLowerCase() } },
            { name: { contains: filter.name.toUpperCase() } },
            { name: { contains: filter.name } },
          ],
        }
      }

      if (filter.companyId && !isNaN(filter.companyId)) {
        where.companyId = filter.companyId
      }
    }

    const data = await db.client.findMany({
      skip,
      take: limit,
      where,
      include: {
        company: true,
      },
    })

    const total = await db.client.count({ where })
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
    return await db.client.findUnique({
      where: { id },
      include: {
        company: true,
      },
    })
  }
  getTopClients = async () => {
    const data = await db.client.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        _count: {
          select: {
            Project: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
      },
      orderBy: {
        Project: {
          _count: 'desc',
        },
      },
      take: 5,
    })

    const clients = data
      .filter((item) => !!item._count.Project)
      .map((item) => ({
        clientId: item.id,
        clientName: item.name,
        count: item._count.Project,
      }))

    const colors = ['#2A9D90', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']

    const chartData: ChartData[] = clients.map((item, index) => ({
      client: item.clientName.toLowerCase(),
      count: item.count,
      fill: colors[index],
    }))

    const chartConfig: ChartConfig = clients.reduce<ChartConfig>(
      (config, item, index) => {
        const clientKey = item.clientName.toLowerCase()
        config[clientKey] = {
          label: item.clientName,
          color: colors[index],
        }
        return config
      },
      {}
    )

    return {
      chartData,
      chartConfig,
    }
  }
}
