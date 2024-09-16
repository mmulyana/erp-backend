import db from '../../../lib/db'
import { Company } from './schema'

export default class CompanyRepository {
  create = async (data: Company) => {
    try {
      await db.companyClient.create({ data })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, data: Company) => {
    try {
      await db.companyClient.update({ data, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.companyClient.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async () => {
    try {
      return await db.companyClient.findMany()
    } catch (error) {
      throw error
    }
  }
}
