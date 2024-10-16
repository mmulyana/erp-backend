import db from '../../../lib/db'
import { Activity } from './schema'

export default class ActivityRepository {
  create = async (data: Activity) => {
    await db.activity.create({ data })
  }
  update = async (id: number, data: Partial<Activity>) => {
    await db.activity.update({ data, where: { id } })
  }
  delete = async (id: number) => {
    await db.activity.delete({ where: { id } })
  }
  read = async () => {
    return await db.activity.findMany()
  }
}
