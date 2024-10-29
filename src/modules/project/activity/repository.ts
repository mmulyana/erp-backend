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
        replyId: true
      },
    })
  }
  read = async (projectId: number, id?: number) => {
    const baseInclude = {
      attachments: true,
      user: true,
      likes: true,
      replies: true,
    }

    if (id) {
      return await db.activity.findUnique({
        where: { id },
        include: {
          ...baseInclude,
          replies: {
            include: {
              user: true,
              likes: true,
              attachments: true,
            },
            orderBy: [
              { updated_at: 'desc' },
              { created_at: 'desc' },
            ],
          },
        },
      })
    }

    return await db.activity.findMany({
      where: {
        projectId,
        replyId: null,
      },
      include: baseInclude,
      orderBy: [
        { updated_at: 'desc' },
        { created_at: 'desc' },
      ],
    })
  }
}
