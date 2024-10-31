import db from '../../../lib/db'
import { Client } from './schema'

export default class ClientRepository {
  create = async (payload: Client) => {
    await db.client.create({
      data: { ...payload, companyId: Number(payload.companyId) || null },
    })
  }
  update = async (id: number, payload: Client) => {
    return await db.client.update({
      data: { ...payload, companyId: Number(payload.companyId) || null },
      where: { id },
      select: { id: true },
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
  readOne = async (id: number) => {
    return await db.client.findUnique({
      where: { id },
      include: {
        company: true,
      },
    })
  }
}
