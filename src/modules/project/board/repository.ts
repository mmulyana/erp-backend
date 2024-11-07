import { generateUUID } from '../../../utils/generate-uuid'
import { Board } from './schema'
import db from '../../../lib/db'

type ChartData = {
  [key: string]: number
}

type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

export default class BoardRepository {
  create = async (data: Board) => {
    const lastContainer = await db.boardContainer.findFirst({
      orderBy: {
        position: 'desc',
      },
    })
    const position = lastContainer ? lastContainer.position + 1 : 0
    const id = `container-${generateUUID()}`
    await db.boardContainer.create({ data: { ...data, id, position } })
  }
  update = async (id: string, data: Board) => {
    await db.boardContainer.update({ data, where: { id } })
  }
  delete = async (id: string) => {
    await db.boardContainer.delete({ where: { id } })
  }
  read = async () => {
    return await db.boardContainer.findMany({
      orderBy: {
        position: 'asc',
      },
    })
  }
  getBoardChart = async () => {
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
          {}
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
}
