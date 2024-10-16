import db from '../../../lib/db'
import { removeImg } from '../../../utils/file'
import { Company } from './schema'

export default class CompanyRepository {
  create = async (data: Company & { logo?: string }) => {
    await db.companyClient.create({ data })
  }
  update = async (id: number, data: Partial<Company & { logo?: string }>) => {
    if (data.logo) {
      const data = await db.companyClient.findUnique({ where: { id } })
      if (data?.logo) {
        removeImg(data.logo)
      }
    }
    await db.companyClient.update({ data, where: { id } })
  }
  delete = async (id: number) => {
    const data = await db.companyClient.findUnique({ where: { id } })
    if (data?.logo) {
      removeImg(data.logo)
    }
    await db.companyClient.delete({ where: { id } })
  }
  read = async () => {
    return await db.companyClient.findMany()
  }
}
