import db from '../../../lib/db'
import { Label } from './schema'

export default class LabelRepository {
  create = async (data: Label) => {
    try {
      await db.projectLabel.create({ data })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, data: Label) => {
    try {
      await db.projectLabel.update({ data, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.projectLabel.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async () => {
    try {
      return await db.projectLabel.findMany()
    } catch (error) {
      throw error
    }
  }
}
