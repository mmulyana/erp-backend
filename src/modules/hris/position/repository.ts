import { z } from 'zod'
import positionSchema from './schema'
import db from '../../../lib/db'
import { MESSAGE_ERROR } from '../../../utils/constant/error'

type Payload = z.infer<typeof positionSchema.create>
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

export default class PositionRepository {
  create = async (payload: Payload) => {
    await db.position.create({ data: payload })
  }
  update = async (id: number, payload: Payload) => {
    await this.isExist(id)
    await db.position.update({ data: payload, where: { id } })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.position.delete({ where: { id } })
  }
  read = async (id: number) => {
    await this.isExist(id)

    const data = await db.position.findUnique({
      where: { id },
      select: {
        description: true,
        name: true,
        color: true,
      },
    })

    return data
  }
  readAll = async () => {
    const data = await db.position.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            employees: true,
          },
        },
      },
    })
    return data
  }
  totalEmployeePerPosition = async () => {
    const data = await db.position.findMany({
      select: {
        id: true,
        name: true,
        color: true,
        _count: {
          select: {
            employees: true,
          },
        },
      },
    })

    const chartData: ChartDataItem[] = data.map((item) => ({
      position: item.name.toLowerCase(),
      count: item._count.employees,
      fill: item.color,
    }))

    const chartConfig: ChartConfig = data.reduce<ChartConfig>(
      (config, item) => {
        const positionKey = item.name.toLowerCase()
        config[positionKey] = {
          label: item.name,
        }
        return config
      },
      {}
    )

    return { chartData, chartConfig }
  }
  totalEmployeePerStatus = async () => {
    const employees = await db.employee.groupBy({
      by: 'status',
      _count: {
        status: true,
      },
    })

    const data = employees.map((item) => ({
      status: item.status,
      count: item._count.status,
    }))
    const chartData: ChartDataItem2[] = data.map((item) => ({
      status: item.status,
      count: item.count,
      fill: item.status === 'active' ? '#2A9D90' : '#F4A462',
    }))

    const chartConfig: ChartConfig = data.reduce((config, item) => {
      config[item.status] = {
        label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      }
      return config
    }, {} as ChartConfig)

    return { chartData, chartConfig }
  }

  protected isExist = async (id: number) => {
    const data = await db.position.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.POSITION.NOT_FOUND)
  }
}
