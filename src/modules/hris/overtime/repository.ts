import { z } from 'zod'
import { overtimeSchema } from './schema'
import db from '../../../lib/db'

type payload = z.infer<typeof overtimeSchema>
export default class OvertimeRepository {
  create = async (payload: payload) => {
    try {
      await db.overtime.create({
        data: { ...payload, date: new Date(payload.date).toISOString() },
      })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: payload) => {
    try {
      await db.overtime.update({
        data: { ...payload, date: new Date(payload.date).toISOString() },
        where: { id },
      })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.overtime.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (id?: number) => {
    try {
      if (!!id) {
        const data = await db.overtime.findUnique({ where: { id } })
        return data
      }

      const data = await db.overtime.findMany()
      return data
    } catch (error) {
      throw error
    }
  }
}
