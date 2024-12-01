import { z } from 'zod'
import positionSchema from './schema'
import db from '../../../lib/db'
import Message from '../../../utils/constant/message'

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
  private message: Message = new Message('Jabatan')
  create = async (payload: Payload) => {
    await db.position.create({ data: payload })
  }
  update = async (id: number, payload: Payload) => {
    await this.isExist(id)
    await db.position.update({ data: payload, where: { id } })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    const hasEmployee = await db.employee.findMany({
      where: { positionId: id, isHidden: false, status: true },
    })
    if (hasEmployee) {
      throw Error(
        'Jabatan tidak bisa dihapus, karena masih ada pegawai dengan jabatan ini. Silahkan ganti jabatan pegawai atau hapus'
      )
    }
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
  readAll = async (name?: string) => {
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
      where: name
        ? {
            OR: [
              { name: { contains: name.toLowerCase() } },
              { name: { contains: name.toUpperCase() } },
              { name: { contains: name } },
            ],
          }
        : {},
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
            employees: {
              where: {
                isHidden: false,
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
      where: {
        isHidden: false,
      },
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

  protected isExist = async (id: number) => {
    const data = await db.position.findUnique({ where: { id } })
    if (!data) throw Error(this.message.notfound())
  }
}
