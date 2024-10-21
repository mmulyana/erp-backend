import db from '../../../lib/db'
import { Label } from './schema'

export default class LabelRepository {
  create = async (data: Label) => {
    await db.projectLabel.create({ data })
  }
  update = async (id: number, data: Label) => {
    await db.projectLabel.update({
      data,
      where: { id },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    })
  }
  delete = async (id: number) => {
    await db.projectLabel.delete({ where: { id } })
  }
  read = async (name?: string) => {
    if (name !== '') {
      const data = await db.projectLabel.findMany({
        where: {
          name: {
            contains: name,
          },
        },
        include: {
          _count: {
            select: {
              projects: true,
            },
          },
        },
      })
      return data
    }
    return await db.projectLabel.findMany({
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    })
  }
  readOne = async (id: number) => {
    return await db.projectLabel.findUnique({ where: { id } })
  }
}
