import path from 'path'
import db from '../../../lib/db'
import { Brand } from './schema'
import fs from 'fs'

export default class BrandRepository {
  create = async (payload: Brand & { photoUrl?: string }) => {
    try {
      await db.brand.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (
    id: number,
    payload: Partial<Brand> & { photoUrl?: string }
  ) => {
    try {
      if (payload.photoUrl) {
        const data = await db.brand.findUnique({ where: { id } })
        if (data?.photoUrl) {
          fs.unlink(path.join('public/img', data.photoUrl), (err) => {
            if (err) {
              console.error(`Error deleting original file: ${err}`)
            }
          })
        }
      }
      await db.brand.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      const data = await db.brand.findUnique({ where: { id } })

      if (data?.photoUrl) {
        fs.unlink(path.join('public/img', data.photoUrl), (err) => {
          if (err) {
            console.error(`Error deleting original file: ${err}`)
          }
        })
      }

      await db.brand.delete({ where: { id } })
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

      return await db.brand.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }
}
