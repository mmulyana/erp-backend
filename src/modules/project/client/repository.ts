import db from '../../../lib/db'
import { Client } from './schema'

export default class ClientRepository {
  create = async (data: Client) => {
    await db.client.create({ data })
  }
  update = async (id: number, data: Client) => {
    await db.client.update({ data, where: { id } })
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
