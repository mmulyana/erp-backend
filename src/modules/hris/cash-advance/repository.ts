import { z } from 'zod'
import { cashAdvanceSchema } from './schema'
import db from '../../../lib/db'
import { MESSAGE_ERROR } from '../../../utils/constant/error'

type cashAdvance = z.infer<typeof cashAdvanceSchema>
export default class CashAdvanceRepository {
  create = async (payload: cashAdvance) => {
    try {
      await db.cashAdvance.create({
        data: {
          ...payload,
          approvalDate: new Date(payload.approvalDate).toISOString(),
          requestDate: new Date(payload.requestDate).toISOString(),
        },
      })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: cashAdvance) => {
    try {
      await this.isExist(id)
      await db.cashAdvance.update({
        data: {
          ...payload,
          approvalDate: new Date(payload.approvalDate).toISOString(),
          requestDate: new Date(payload.requestDate).toISOString(),
        },
        where: {
          id,
        },
      })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
      await db.cashAdvance.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (id?: number) => {
    try {
      if (!!id) {
        await this.isExist(id)
        const data = await db.cashAdvance.findUnique({ where: { id } })
        return data
      }
      const data = await db.cashAdvance.findMany()
      return data
    } catch (error) {
      throw error
    }
  }
  protected isExist = async (id: number) => {
    const data = await db.cashAdvance.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.CASH_ADVANCE.NOT_FOUND)
  }
}
