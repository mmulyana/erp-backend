import { z } from 'zod'
import {
  contactSchema,
  addressSchema,
  employeeSchema,
  createCompetencySchema,
  updateCompetencySchema,
  certifchema,
} from './schema'
import { MESSAGE_ERROR } from '../../../utils/constant/error'
import db from '../../../lib/db'

type Employee = z.infer<typeof employeeSchema>
type Contact = z.infer<typeof contactSchema>
type Address = z.infer<typeof addressSchema>
type Competency = z.infer<typeof createCompetencySchema>
type UpdateCompetency = z.infer<typeof updateCompetencySchema>
type Certification = z.infer<typeof certifchema>

export type FilterEmployee = {
  fullname?: string
  positionId?: number
}

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
  readAll = async (
    page: number = 1,
    limit: number = 10,
    filter?: FilterEmployee
  ) => {
    try {
      const skip = (page - 1) * limit
      const where: any = {}

      if (filter) {
        if ('fullname' in filter) {
          where.OR = [
            { fullname: { contains: filter.fullname, mode: 'insensitive' } },
            { nickname: { contains: filter.fullname, mode: 'insensitive' } },
          ]
        }

        if ('positionId' in filter) {
          where.positionId = filter.positionId
        }
      }
      
      const data = await db.employee.findMany({
        skip,
        take: limit,
        where,
      })

      const total = await db.employee.count({ where })
      return { data, total, page, limit }
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

  // Competency
  createCompetency = async (employeeId: number, payload: Competency) => {
    try {
      const data = await db.competency.create({
        data: { name: payload.name, employeeId },
      })
      if (!!payload.certifications?.length) {
        await db.certification.createMany({
          data: payload.certifications.map((certif: any) => ({
            competencyId: data.id,
            expiryDate: certif.expiryDate,
            issueDate: certif.issueDate,
            issuingOrganization: certif.issuingOrganization,
            name: certif.name,
          })),
        })
      }
    } catch (error) {
      throw error
    }
  }
  updateCompetency = async (payload: UpdateCompetency) => {
    try {
      await db.competency.update({
        data: {
          name: payload.name,
        },
        where: {
          id: payload.id,
        },
      })
    } catch (error) {
      throw error
    }
  }
  // competencyId
  deleteCompetency = async (id: number) => {
    try {
      await db.competency.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  // competencyId
  readCompetency = async (id: number) => {
    try {
      if (!!id) {
        const data = await db.competency.findUnique({ where: { id } })
        return data
      }
      const data = await db.competency.findMany()
      return data
    } catch (error) {
      throw error
    }
  }

  // Certif
  createCertif = async (competencyId: number, payload: Certification) => {
    try {
      await db.certification.create({ data: { ...payload, competencyId } })
    } catch (error) {
      throw error
    }
  }
  updateCertif = async (certifId: number, payload: Certification) => {
    try {
      await db.certification.update({ data: payload, where: { id: certifId } })
    } catch (error) {
      throw error
    }
  }
  deleteCertif = async (certifId: number) => {
    try {
      await db.certification.delete({ where: { id: certifId } })
    } catch (error) {
      throw error
    }
  }
  readCertif = async (certifId?: number) => {
    try {
      if (!!certifId) {
        const data = await db.certification.findUnique({
          where: { id: certifId },
        })
        return data
      }
      const data = await db.certification.findMany()
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
