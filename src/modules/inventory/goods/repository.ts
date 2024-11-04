import { Goods as GoodsSchema, Prisma } from '@prisma/client'
import { toNumber } from '../../../utils/to-number'
import { deleteFile } from '../../../utils/file'
import db from '../../../lib/db'
import { Goods } from './schema'

interface FilterGoods {
  name?: string
  locationId?: number
  categoryId?: number
  brandId?: number
  measurementId?: number
}

export default class GoodsRepository {
  create = async (payload: Goods & { photoUrl?: string }) => {
    const data: any = {
      name: payload.name,
      qty: Number(payload.qty) || 0,
      available: Number(payload.qty) || 0,
      minimum: Number(payload.minimum) || 1,
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
  softDelete = async (id: number) => {
    await db.goods.update({ data: { is_deleted: true }, where: { id } })
  }
  readByPagination = async (
    page: number = 1,
    limit: number = 10,
    filter?: FilterGoods
  ) => {
    const skip = (page - 1) * limit
    let where: Prisma.GoodsWhereInput = {
      is_deleted: false,
    }

    if (filter) {
      if (
        filter.name &&
        filter.name !== 'undefined' &&
        filter.name.trim() !== ''
      ) {
        where = {
          ...where,
          OR: [
            { name: { contains: filter.name.toLowerCase() } },
            { name: { contains: filter.name.toUpperCase() } },
            { name: { contains: filter.name } },
          ],
        }
      }

      if (filter.locationId && !isNaN(filter.locationId)) {
        where.locationId = filter.locationId
      }

      if (filter.categoryId && !isNaN(filter.categoryId)) {
        where.categoryId = filter.categoryId
      }

      if (filter.brandId && !isNaN(filter.brandId)) {
        where.brandId = filter.brandId
      }

      if (filter.measurementId && !isNaN(filter.measurementId)) {
        where.measurementId = filter.measurementId
      }
    }

    const data = await db.goods.findMany({
      skip,
      take: limit,
      where,
      include: {
        brand: true,
        category: true,
        location: true,
        measurement: true,
      },
    })

    const total = await db.goods.count({ where })
    const total_pages = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      total_pages,
    }
  }
  readAll = async () => {
    return await db.goods.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        brand: true,
        category: true,
        location: true,
        measurement: true,
      },
    })
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
      select * from "Goods" where qty <= minimum AND qty > 0 OR available <= minimum AND available > 0 AND is_deleted = false
    `
  }
  readOutofStock = async () => {
    return await db.$queryRaw`
      select * from "Goods" where qty = 0 OR available = 0 AND is_deleted = false
    `
  }
}
