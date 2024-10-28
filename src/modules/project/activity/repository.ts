import db from '../../../lib/db'
import { Activity } from './schema'

export default class ActivityRepository {
  create = async (data: Activity) => {
    return await db.activity.create({
      data,
      select: { projectId: true, replyId: true },
    })
  }
  update = async (id: number, data: Partial<Activity>) => {
    return await db.activity.update({
      data,
      where: { id },
      select: {
        id: true,
        projectId: true,
        replyId: true,
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
  read = async (projectId: number, id?: number) => {
    let baseQuery: any = {
      include: {
        attachments: true,
        user: true,
        replies: {
          include: {
            user: true,
          },
        },
        likes: true,
      },
    }
    if (projectId) {
      baseQuery.where = {
        projectId,
      }
    }
    if (id) {
      baseQuery.where = {
        ...baseQuery.query,
        id,
      }
      return await db.activity.findUnique(baseQuery)
    } else {
      baseQuery.where = {
        ...baseQuery.where,
        replyId: null,
      }
      return await db.activity.findMany(baseQuery)
    }
  }
}
