import { z } from 'zod'
import {
  createAddressSchema,
  createContactSchema,
  deleteAddress,
  employeeSchema,
  positionSchema,
  updateAddressSchema,
  updateContactSchema,
} from './schema'
import { MESSAGE_ERROR } from '../../../utils/constant/error'
import db from '../../../lib/db'

type Employee = z.infer<typeof employeeSchema>
type CreateContact = z.infer<typeof createContactSchema>
type UpdateContact = z.infer<typeof updateContactSchema>
type CreateAddress = z.infer<typeof createAddressSchema>
type UpdateAddress = z.infer<typeof updateAddressSchema>
type DeleteAddress = z.infer<typeof deleteAddress>
type Position = z.infer<typeof positionSchema>

export default class EmployeeRepository {
  create = async (payload: Employee) => {
    try {
      await db.employee.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Employee) => {
    try {
      await this.isExist(id)
      await db.employee.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
      await db.employee.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (id: number) => {
    try {
      await this.isExist(id)
      const data = await db.employee.findUnique({ where: { id } })
      return data
    } catch (error) {
      throw error
    }
  }
  readAll = async () => {
    try {
      const data = await db.employee.findMany()
      return data
    } catch (error) {
      throw error
    }
  }

  private isExist = async (id: number) => {
    const data = await db.employee.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.EMPLOYEE.NOT_FOUND)
  }
}