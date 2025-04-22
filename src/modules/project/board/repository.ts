import { generateUUID } from '@/utils/generate-uuid'
import db from '@/lib/prisma'

import { Board } from './schema'

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
