import db from '../../../lib/db'
import { EmployeeSupplierSchema } from './schema'

export default class EmployeeSupplierRepository {
  create = async (payload: EmployeeSupplierSchema) => {
    try {
      await db.supplierEmployee.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: EmployeeSupplierSchema) => {
    await db.supplierEmployee.update({ data: payload, where: { id } })
    try {
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.supplierEmployee.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (name?: string) => {
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

      return await db.supplierEmployee.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }
}
