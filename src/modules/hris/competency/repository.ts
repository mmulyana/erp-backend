import { z } from 'zod'
import { competencySchema } from './schema'
import db from '../../../lib/db'

type competency = z.infer<typeof competencySchema>
export default class CompetencyRepository {
  create = async (data: competency) => {
    try {
      await db.competency.create({ data })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, data: competency) => {
    try {
      await db.competency.update({
        data,
        where: { id },
      })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.competency.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (name?: string) => {
    try {
      if (name !== '') {
        const data = await db.competency.findMany({
          where: {
            name: {
              contains: name,
            },
          },
        })
        return data
      }
      return await db.competency.findMany()
    } catch (error) {
      throw error
    }
  }
}
