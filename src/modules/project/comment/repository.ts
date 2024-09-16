import db from '../../../lib/db'
import { Comment } from './schema'

export default class CommentRepository {
  create = async (data: Comment) => {
    try {
      await db.projectComment.create({ data })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, data: Comment) => {
    try {
      await db.projectComment.update({ data, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.projectComment.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async () => {
    try {
      return await db.projectComment.findMany()
    } catch (error) {
      throw error
    }
  }
}
