import db from '../../../lib/db'
import { Client } from './schema'

export default class ClientRepository {
  create = async (data: Client) => {
    try {
      await db.client.create({ data })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, data: Client) => {
    try {
      await db.client.update({ data, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.client.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async () => {
    try {
      return await db.client.findMany()
    } catch (error) {
      throw error
    }
  }
}
