import db from '../../../lib/db'
import { Activity } from './schema'

export default class ActivityRepository {
  create = async (data: Activity) => {
    return await db.activity.create({ data, select: { projectId: true } })
  }
  update = async (id: number, data: Partial<Activity>) => {
    return await db.activity.update({
      data,
      where: { id },
      select: {
        id: true,
        projectId: true,
      },
    })
  }
  delete = async (id: number) => {
    return await db.activity.delete({
      where: { id },
      select: {
        projectId: true,
      },
    })
  }
  read = async (id?: number) => {
    let baseQuery: any = {
      include: {
        attachments: true,
        user: true
      },
    }
    if (id) {
      baseQuery.where = {
        projectId: id,
      }
    }
    return await db.activity.findMany(baseQuery)
  }
}
