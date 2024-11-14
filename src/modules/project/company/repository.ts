import { Prisma } from '@prisma/client'
import db from '../../../lib/db'
import { deleteFile } from '../../../utils/file'
import { Company } from './schema'

type Filter = {
  name?: string
}

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
    return await db.companyClient.update({
      data,
      where: { id },
      select: { id: true },
    })
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
  readByPagination = async (
    page: number = 1,
    limit: number = 10,
    filter?: Filter
  ) => {
    const skip = (page - 1) * limit
    let where: Prisma.CompanyClientWhereInput = {}

    if (filter) {
      if (filter.name) {
        where = {
          OR: [
            { name: { contains: filter.name.toLowerCase() } },
            { name: { contains: filter.name.toUpperCase() } },
            { name: { contains: filter.name } },
          ],
        }
      }
    }

    const data = await db.companyClient.findMany({
      skip,
      take: limit,
      where,
    })

    const total = await db.companyClient.count({ where })
    const total_pages = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      total_pages,
    }
  }
}
