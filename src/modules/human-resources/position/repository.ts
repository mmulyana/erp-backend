import { z } from 'zod'
import positionSchema from './schema'
import db from '../../../lib/db'

type Payload = z.infer<typeof positionSchema.create>

export default class PositionRepository {
  create = async (payload: Payload) => {
    try {
      await db.position.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Payload) => {
    try {
      await db.position.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.position.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (id: number) => {
    try {
      const data = await db.position.findUnique({
        where: { id },
        select: {
          description: true,
          name: true,
        },
      })

      return data
    } catch (error) {
      throw error
    }
  }
  readAll = async () => {
    try {
      const data = await db.position.findMany()
      return data
    } catch (error) {
      throw error
    }
  }
}
