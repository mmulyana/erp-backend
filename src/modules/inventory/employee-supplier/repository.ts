import { EmployeeSupplierSchema } from './schema'
import db from '../../../lib/db'

export default class EmployeeSupplierRepository {
  create = async (payload: EmployeeSupplierSchema) => {
    return await db.supplierEmployee.create({ data: payload })
  }
  update = async (id: number, payload: EmployeeSupplierSchema) => {
    await this.isExist(id)
    return await db.supplierEmployee.update({ data: payload, where: { id } })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    return await db.supplierEmployee.delete({ where: { id } })
  }
  read = async (supplierId?: number, name?: string) => {
    const baseQuery = {
      where: {},
    }

    if (supplierId) {
      baseQuery.where = {
        ...baseQuery.where,
        supplierId,
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
  }
  readOne = async (id: number) => {
    await this.isExist(id)

    return db.supplierEmployee.findUnique({ where: { id } })
  }
  isExist = async (id: number) => {
    const data = await db.supplierEmployee.findUnique({ where: { id } })
    if (!data) throw Error('Pegawai supplier ini tidak ditemukan')
  }
}
