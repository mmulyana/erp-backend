import { deleteFile } from '../../../utils/file'
import db from '../../../lib/db'
import { Goods } from './schema'

export default class GoodsRepository {
  create = async (payload: Goods & { photoUrl?: string }) => {
    await db.goods.create({
      data: {
        name: payload.name,
        qty: Number(payload.qty),
        available: Number(payload.qty),
        minimum: Number(payload.minimum),
        photoUrl: payload.photoUrl,
        location: {
          connect: {
            id: Number(payload.locationId),
          },
        },
        measurement: { connect: { id: Number(payload.measurementId) } },
        brand: { connect: { id: Number(payload.brandId) } },
        category: { connect: { id: Number(payload.categoryId) } },
      },
    })
  }
  update = async (
    id: number,
    payload: Partial<Goods> & { newPhotoUrl?: string }
  ) => {
    if (payload.newPhotoUrl !== '') {
      const data = await db.brand.findUnique({ where: { id } })
      if (data?.photoUrl) {
        deleteFile(data.photoUrl)
      }
    }
    return await db.goods.update({
      data: {
        name: payload.name,
        qty: Number(payload.qty),
        available: Number(payload.qty),
        minimum: Number(payload.minimum),
        ...(payload.newPhotoUrl !== ''
          ? { photoUrl: payload.newPhotoUrl }
          : undefined),
        location: {
          connect: {
            id: Number(payload.locationId),
          },
        },
        ...(payload.measurementId !== ''
          ? {
              measurement: { connect: { id: Number(payload.measurementId) } },
            }
          : undefined),
        ...(payload.brandId !== ''
          ? {
              brand: { connect: { id: Number(payload.brandId) } },
            }
          : undefined),
        ...(payload.categoryId !== ''
          ? {
              category: { connect: { id: Number(payload.categoryId) } },
            }
          : undefined),
      },
      where: { id },
      select: {
        id: true,
      },
    })
  }
  delete = async (id: number) => {
    const data = await db.goods.findUnique({ where: { id } })

    if (data?.photoUrl) {
      deleteFile(data.photoUrl)
    }

    await db.goods.delete({ where: { id } })
  }
  read = async (name: string | undefined) => {
    const baseQuery = {
      where: {},
      include: {
        brand: true,
        category: true,
        location: true,
        measurement: true,
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

    return await db.goods.findMany(baseQuery)
  }
  readOne = async (id: number) => {
    return await db.goods.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        location: true,
        measurement: true,
        transaction: true,
        _count: {
          select: {
            transaction: true,
          },
        },
      },
    })
  }
}
