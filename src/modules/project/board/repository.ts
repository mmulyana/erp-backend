import db from '../../../lib/db'
import { generateUUID } from '../../../utils/generate-uuid'
import { Board } from './schema'

export default class BoardRepository {
  create = async (data: Board) => {
    try {
      const lastContainer = await db.boardContainer.findFirst({
        orderBy: {
          position: 'desc',
        },
      })
      const position = lastContainer ? lastContainer.position + 1 : 0
      const id = `container-${generateUUID()}`
      await db.boardContainer.create({ data: { ...data, id, position } })
    } catch (error) {
      throw error
    }
  }
  update = async (id: string, data: Board) => {
    try {
      await db.boardContainer.update({ data, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: string) => {
    try {
      await db.boardContainer.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async () => {
    try {
      return await db.boardContainer.findMany()
    } catch (error) {
      throw error
    }
  }
}
