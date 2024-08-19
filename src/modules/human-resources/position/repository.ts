import { z } from 'zod'
import positionSchema from './schema'
import db from '../../../lib/db'
import { MESSAGE_ERROR } from '../../../utils/constant/error'

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
      await this.isExist(id)

      await db.position.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)

      await db.position.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (id: number) => {
    try {
      await this.isExist(id)

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

  protected isExist = async (id: number) => {
    const data = await db.position.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.POSITION.NOT_FOUND)
  }
}
