import db from '@/lib/prisma'
import { Board } from './schema'
import { generateUUID } from '@/utils/generate-uuid'

type ChartData = {
  [key: string]: number
}

type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

export const create = async (data: Board) => {
  const lastContainer = await db.boardContainer.findFirst({
    orderBy: {
      position: 'desc',
    },
  })
  const position = lastContainer ? lastContainer.position + 1 : 0
  const id = `container-${generateUUID()}`
  await db.boardContainer.create({
    data: {
      id,
      position,
      name: data.name,
      color: data.color,
    },
  })
}

export const update = async (id: string, data: Board) => {
  await db.boardContainer.update({ data, where: { id } })
}

export const destroy = async (id: string) => {
  await db.boardContainer.delete({ where: { id } })
}

export const read = async () => {
  return await db.boardContainer.findMany({
    orderBy: {
      position: 'asc',
    },
  })
}

export const getBoardChart = async () => {
  const boardStats = await db.boardContainer.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy: {
      position: 'asc',
    },
  })

  const chartData: ChartData[] = [
    {
      ...boardStats.reduce(
        (acc, board) => ({
          ...acc,
          [board.name]: board._count.items,
        }),
        {},
      ),
    },
  ]

  const chartConfig: ChartConfig = boardStats.reduce((config, board) => {
    const key = board.name

    config[key] = {
      label: board.name,
      color: board.color,
    }

    return config
  }, {} as ChartConfig)

  return {
    chartData,
    chartConfig,
  }
}
