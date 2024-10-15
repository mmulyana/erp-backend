import { z } from 'zod'
import { competencySchema } from './schema'
import db from '../../../lib/db'

type competency = z.infer<typeof competencySchema>
export default class CompetencyRepository {
  create = async (data: competency) => {
    await db.competency.create({ data })
  }
  update = async (id: number, data: competency) => {
    await db.competency.update({
      data,
      where: { id },
    })
  }
  delete = async (id: number) => {
    await db.competency.delete({ where: { id } })
  }
  read = async (name?: string) => {
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
  }
}
