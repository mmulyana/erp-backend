import db from '../../../lib/db'
import { Estimate } from './schema'

export default class EstimateRepository {
  create = async (data: Estimate) => {
    return await db.projectEstimate.create({
      data,
    })
  }
  update = async (id: number, data: Partial<Estimate>) => {
    return await db.projectEstimate.update({
      data,
      where: { id },
    })
  }
  delete = async (id: number) => {
    return await db.projectEstimate.delete({ where: { id } })
  }
  read = async (id: number) => {
    return await db.projectEstimate.findMany({
      where: {
        id,
      },
    })
  }
}
