import db from '../../../lib/db'
import { deleteFile } from '../../../utils/file'
import { Company } from './schema'

export default class CompanyRepository {
  create = async (data: Company & { logo?: string }) => {
    await db.companyClient.create({ data })
  }
  update = async (id: number, data: Partial<Company & { logo?: string }>) => {
    if (data.logo) {
      const data = await db.companyClient.findUnique({ where: { id } })
      if (data?.logo) {
        deleteFile(data.logo)
      }
    }
    return await db.companyClient.update({ data, where: { id }, select: { id: true } })
  }
  delete = async (id: number) => {
    const data = await db.companyClient.findUnique({ where: { id } })
    if (data?.logo) {
      deleteFile(data.logo)
    }
    await db.companyClient.delete({ where: { id } })
  }
  read = async () => {
    return await db.companyClient.findMany()
  }
  readOne = async (id: number) => {
    return await db.companyClient.findUnique({ where: { id } })
  }
}
