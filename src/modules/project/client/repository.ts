import db from '../../../lib/db'
import { Client } from './schema'

export default class ClientRepository {
  create = async (payload: Client) => {
    await db.client.create({
      data: { ...payload, companyId: Number(payload.companyId) || null },
    })
  }
  update = async (id: number, payload: Client) => {
    await db.client.update({
      data: { ...payload, companyId: Number(payload.companyId) || null },
      where: { id },
    })
  }
  delete = async (id: number) => {
    await db.client.delete({ where: { id } })
  }
  read = async () => {
    return await db.client.findMany({
      include: {
        company: true,
      },
    })
  }
}
