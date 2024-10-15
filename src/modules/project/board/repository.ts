import db from '../../../lib/db'
import { generateUUID } from '../../../utils/generate-uuid'
import { Board } from './schema'

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
}
