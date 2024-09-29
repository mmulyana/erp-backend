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
    try {
      await this.isExist(id)
      await db.supplierEmployee.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
      await db.supplierEmployee.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (id?: number, name?: string) => {
    try {
      const baseQuery = {
        where: {},
      }

      if (Number(id)) {
        baseQuery.where = {
          ...baseQuery.where,
          OR: [{ supplierId: Number(id) }],
        }
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
  isExist = async (id: number) => {
    const data = await db.supplierEmployee.findUnique({ where: { id } })
    if (!data) throw Error('Pegawai supplier ini tidak ditemukan')
  }
}
