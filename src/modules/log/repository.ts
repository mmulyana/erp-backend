import db from '../../lib/db'

export type ActivityLog = {
  userId: number
  action: string
  module: string
  description: string
  timestamp: string
}

export default class RepositoryLog {
  create = async (payload: ActivityLog) => {
    await db.activityLog.create({
      data: payload,
    })
  }
  update = async (id: number, payload: ActivityLog) => {
    await db.activityLog.update({
      data: payload,
      where: { id },
    })
  }
  delete = async (id: number) => {
    await db.activityLog.delete({
      where: { id },
    })
  }
  read = async (userId?: number) => {
    if (userId) {
      return await db.activityLog.findMany({
        where: { userId },
        orderBy: {
          timestamp: 'asc',
        },
      })
    }
    return await db.activityLog.findMany({
      orderBy: {
        timestamp: 'asc',
      },
    })
  }
}
