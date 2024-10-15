import db from '../../../lib/db'
import { Comment } from './schema'

export default class CommentRepository {
  create = async (data: Comment) => {
    await db.activity.create({ data })
  }
  update = async (id: number, data: Comment) => {
    await db.activity.update({ data, where: { id } })
  }
  delete = async (id: number) => {
    await db.activity.delete({ where: { id } })
  }
  read = async () => {
    return await db.activity.findMany()
  }
}
