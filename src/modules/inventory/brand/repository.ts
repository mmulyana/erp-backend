import { deleteFile } from '../../../utils/file'
import db from '../../../lib/db'
import { Brand } from './schema'

export default class BrandRepository {
  create = async (payload: Brand & { photoUrl?: string }) => {
    await db.brand.create({ data: payload })
  }
  update = async (
    id: number,
    payload: Partial<Brand> & { photoUrl?: string }
  ) => {
    await this.isExist(id)
    if (payload.photoUrl) {
      const data = await db.brand.findUnique({ where: { id } })
      if (data?.photoUrl) {
        await deleteFile(data.photoUrl)
      }
    }
    return await db.brand.update({
      data: payload,
      where: { id },
      include: {
        _count: {
          select: {
            goods: true,
          },
        },
      },
    })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    const data = await db.brand.findUnique({ where: { id } })

    if (data?.photoUrl) {
      deleteFile(data.photoUrl)
    }

    await db.brand.delete({ where: { id } })
  }
  read = async (name: string | undefined) => {
    const baseQuery = {
      where: {},
      include: {
        _count: {
          select: {
            goods: true,
          },
        },
      },
    }

    if (name) {
      baseQuery.where = {
        ...baseQuery.where,
        OR: [
          { name: { contains: name.toLowerCase() } },
          { name: { contains: name.toUpperCase() } },
          { name: { contains: name } },
        ],
      }
    }

    return await db.brand.findMany(baseQuery)
  }
  readOne = async (id: number) => {
    const data = await db.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            goods: true,
          },
        },
      },
    })

    return {
      ...data,
      photoUrl: data?.photoUrl
        ? process.env.BASE_URL + '/img/' + data?.photoUrl
        : null,
    }
  }
  isExist = async (id: number) => {
    const data = await db.brand.findUnique({ where: { id } })
    if (!data) throw Error('Merek tidak ditemukan')
  }
}
