import { z } from 'zod'
import { leaveSchema } from './schema'
import db from '../../../lib/db'
import { MESSAGE_ERROR } from '../../../utils/constant/error'

type Leave = z.infer<typeof leaveSchema>

export default class LeaveRepository {
  create = async (payload: Leave) => {
    try {
      await db.leave.create({
        data: {
          ...payload,
          startDate: new Date(payload.startDate).toISOString(),
          endDate: new Date(payload.endDate).toISOString(),
        },
      })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Leave) => {
    try {
      await this.isExist(id)
      await db.leave.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
      await db.leave.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (id?: number) => {
    try {
      if (!!id) {
        await this.isExist(id)
        const data = await db.leave.findUnique({
          where: { id },
          select: {
            id: true,
            employee: {
              select: { fullname: true },
            },
            startDate: true,
            endDate: true,
            leaveType: true,
            description: true,
          },
        })
        return data
      }
      const data = await db.leave.findMany({
        select: {
          id: true,
          employee: {
            select: { fullname: true },
          },
          startDate: true,
          endDate: true,
          leaveType: true,
          description: true,
        },
      })
      return data
    } catch (error) {
      throw error
    }
  }

  private isExist = async (id: number) => {
    const data = await db.leave.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.LEAVE.NOT_FOUND)
  }
}
