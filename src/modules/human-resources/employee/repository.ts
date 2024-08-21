import { z } from 'zod'
import {
  ContactSchema,
  AddressSchema,
  employeeSchema,
  positionSchema,
} from './schema'
import { MESSAGE_ERROR } from '../../../utils/constant/error'
import db from '../../../lib/db'

type Employee = z.infer<typeof employeeSchema>
type Contact = z.infer<typeof ContactSchema>
type Address = z.infer<typeof AddressSchema>
type Position = z.infer<typeof positionSchema>

export default class EmployeeRepository {
  // EMPLOYEE
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

  // ADDRESS
  createAddress = async (employeeId: number, payload: Address) => {
    try {
      await this.isExist(employeeId)
      await db.address.create({
        data: { ...payload, employeeId },
      })
    } catch (error) {
      throw error
    }
  }
  updateAddress = async (id: number, payload: Address) => {
    try {
      await this.isAddressExist(id)
      await db.address.update({
        data: payload,
        where: {
          id: id,
        },
      })
    } catch (error) {
      throw error
    }
  }
  deleteAddress = async (id: number) => {
    try {
      await this.isAddressExist(id)
      await db.address.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  readAddress = async (id: number, addressId?: number) => {
    try {
      if (!!addressId) {
        await this.isAddressExist(addressId)
        const data = await db.address.findUnique({ where: { id: addressId } })
        return data
      }

      const data = await db.address.findMany({
        where: {
          employeeId: id,
        },
      })
      return data
    } catch (error) {
      throw error
    }
  }

  // CONTACT
  createContact = async (employeeId: number, payload: Contact) => {
    try {
      await this.isExist(employeeId)
      await db.contact.create({ data: { ...payload, employeeId } })
    } catch (error) {
      throw error
    }
  }
  updateContact = async (id: number, payload: Contact) => {
    try {
      await this.isContactExist(id)
      await db.contact.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  deleteContact = async (id: number) => {
    try {
      await this.isContactExist(id)
      await db.contact.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  readContact = async (contactId?: number) => {
    try {
      if (!!contactId) {
        await this.isContactExist(contactId)
        const data = await db.contact.findUnique({ where: { id: contactId } })
        return data
      }
      const data = await db.contact.findMany()
      return data
    } catch (error) {
      throw error
    }
  }

  updatePositionEmployee = async (id: number, positionId: number) => {
    try {
      await this.isExist(id)
      await this.isPositionExist(positionId)
      await db.employee.update({ data: { positionId }, where: { id } })
    } catch (error) {
      throw error
    }
  }

  updateStatusEmployee = async (id: number, status: 'active' | 'nonactive') => {
    try {
      await this.isExist(id)
      const date = new Date().toISOString()
      await db.employee.update({ data: { status }, where: { id } })
      await db.employeeStatusTrack.create({
        data: {
          status,
          date,
          employeeId: id,
        },
      })
    } catch (error) {
      throw error
    }
  }

  readEmployeeTrack = async (id: number) => {
    try {
      const data = await db.employeeStatusTrack.findMany({
        where: { employeeId: id },
        orderBy: { date: 'asc' },
      })
      return data
    } catch (error) {
      throw error
    }
  }

  private isExist = async (id: number) => {
    const data = await db.employee.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.EMPLOYEE.NOT_FOUND)
  }
  private isAddressExist = async (id: number) => {
    const data = await db.address.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.EMPLOYEE.ADDRESS_NOT_FOUND)
  }
  private isContactExist = async (id: number) => {
    const data = await db.contact.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.EMPLOYEE.CONTACT_NOT_FOUND)
  }
  private isPositionExist = async (id: number) => {
    const data = await db.position.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.EMPLOYEE.POSITION_NOT_FOUND)
  }
}
