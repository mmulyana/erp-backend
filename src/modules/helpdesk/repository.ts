import db from '../../lib/db'
import { HelpdeskSchema } from './schema'

export default class HelpdeskRepository {
  create = async (data: HelpdeskSchema) => {
    return await db.helpdesk.create({ data })
  }
  findAll = async (type?: 'bug' | 'feature') => {
    return await db.helpdesk.findMany({
      where: {
        type: type || undefined,
      },
    })
  }
  findById = async (id: number) => {
    return await db.helpdesk.findUnique({ where: { id } })
  }
  deleteById = async (id: number) => {
    return await db.helpdesk.delete({ where: { id } })
  }
  updateById = async (
    id: number,
    data: HelpdeskSchema & { resolve: boolean }
  ) => {
    return await db.helpdesk.update({ where: { id }, data })
  }
}
