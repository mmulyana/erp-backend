import { z } from 'zod'
import { leaveSchema } from './schema'
import db from '../../../lib/db'

type Leave = z.infer<typeof leaveSchema>

export default class LeaveRepository {
  create = async (payload: Leave) => {
    try {
      await db.leave.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Leave) => {
    try {
      await db.leave.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.leave.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (id?: number) => {
    try {
      if (!!id) {
        const data = await db.leave.findUnique({ where: { id } })
        return data
      }
      const data = await db.leave.findMany()
      return data
    } catch (error) {
      throw error
    }
  }
}
