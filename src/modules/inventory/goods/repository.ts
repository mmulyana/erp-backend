import db from '../../../lib/db'
import { removeImg } from '../../../utils/file'
import { Goods } from './schema'

export default class GoodsRepository {
  create = async (payload: Goods & { photoUrl?: string }) => {
    try {
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
    } catch (error) {
      throw error
    }
  }
  update = async (
    id: number,
    payload: Partial<Goods> & { newPhotoUrl?: string }
  ) => {
    try {
      if (payload.newPhotoUrl !== '') {
        const data = await db.brand.findUnique({ where: { id } })
        if (!!data?.photoUrl) {
          await removeImg(data.photoUrl)
        }
      }
      await db.goods.update({
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
      })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      const data = await db.goods.findUnique({ where: { id } })

      if (data?.photoUrl) {
        removeImg(data.photoUrl)
      }

      await db.goods.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (name: string | undefined) => {
    try {
      const baseQuery = {
        where: {},
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
    } catch (error) {
      throw error
    }
  }
}
