import { Goods as GoodsSchema } from '@prisma/client'
import { toNumber } from '../../../utils/to-number'
import { deleteFile } from '../../../utils/file'
import db from '../../../lib/db'
import { Goods } from './schema'

export default class GoodsRepository {
  create = async (payload: Goods & { photoUrl?: string }) => {
    const data: any = {
      name: payload.name,
      qty: Number(payload.qty),
      available: Number(payload.qty),
      minimum: Number(payload.minimum),
    }

    if (payload.photoUrl) {
      data.photoUrl = payload.photoUrl
    }

    if (payload.locationId) {
      data.location = {
        connect: { id: Number(payload.locationId) },
      }
    }

    if (payload.measurementId) {
      data.measurement = {
        connect: { id: Number(payload.measurementId) },
      }
    }

    if (payload.brandId) {
      data.brand = {
        connect: { id: Number(payload.brandId) },
      }
    }

    if (payload.categoryId) {
      data.category = {
        connect: { id: Number(payload.categoryId) },
      }
    }

    await db.goods.create({ data })
  }
  update = async (
    id: number,
    payload: Partial<Goods> & { newPhotoUrl?: string; photoUrl: string }
  ) => {
    const updateData: Partial<GoodsSchema> = {}
    if (payload.newPhotoUrl || payload.photoUrl == null) {
      const data = await db.goods.findUnique({ where: { id } })
      if (data?.photoUrl) {
        deleteFile(data.photoUrl)
      }
      updateData.photoUrl = null
    }
    if (payload.newPhotoUrl) {
      updateData.photoUrl = payload.newPhotoUrl
    }

    if (payload.name) {
      updateData.name = payload.name
    }

    const qty = toNumber(payload.qty)
    if (qty) {
      updateData.qty = qty
      updateData.available = qty
    }

    const minimum = toNumber(payload.minimum)
    if (minimum) {
      updateData.minimum = minimum
    }

    const locationId = toNumber(payload.locationId)
    if (locationId) {
      updateData.locationId = locationId
    }

    const measurementId = toNumber(payload.measurementId)
    if (measurementId) {
      updateData.measurementId = measurementId
    }

    const brandId = toNumber(payload.brandId)
    if (brandId) {
      updateData.brandId = brandId
    }

    const categoryId = toNumber(payload.categoryId)
    if (categoryId) {
      updateData.categoryId = categoryId
    }

    return await db.goods.update({
      data: updateData,
      where: { id },
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
        transactions: true,
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    })
  }

  readLowStock = async () => {
    return await db.$queryRaw`
      select * from "Goods" where qty <= minimum OR available <= minimum
    `
  }
  readOutofStock = async () => {
    return await db.$queryRaw`
      select * from "Goods" where qty = 0 OR available = 0
    `
  }
}
