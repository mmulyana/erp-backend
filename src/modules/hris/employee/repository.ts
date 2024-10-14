import { z } from 'zod'
import {
  contactSchema,
  addressSchema,
  employeeSchema,
  competencySchema,
  certifchema,
} from './schema'
import { MESSAGE_ERROR } from '../../../utils/constant/error'
import db from '../../../lib/db'

type Employee = z.infer<typeof employeeSchema>
type Contact = z.infer<typeof contactSchema>
type Address = z.infer<typeof addressSchema>
type Competency = z.infer<typeof competencySchema>
type Certification = z.infer<typeof certifchema>

export type FilterEmployee = {
  fullname?: string
  positionId?: number
}

export default class EmployeeRepository {
  // EMPLOYEE
  create = async (payload: Employee) => {
    const data = await db.employee.create({
      data: {
        fullname: payload.fullname,
        joined_at: payload.joined_at,
        joined_type: payload.joined_type,
        basic_salary: payload.basic_salary,
        overtime_salary: payload.overtime_salary,
        pay_type: payload.pay_type,
        employment_type: payload.employment_type,
        place_of_birth: payload.place_of_birth,
        birthdate: payload.birthdate,
        gender: payload.gender,
        marital_status: payload.marital_status,
        religion: payload.religion,
        positionId: payload.positionId,
        addresses: {
          create: payload.addresses?.map((item) => ({
            value: item.value,
            type: item.type,
          })),
        },
        contacts: {
          create: payload.contacts?.map((item) => ({
            value: item.value,
            type: item.type,
          })),
        },
        competencies: {
          create: payload.competencyIds?.map((item) => ({
            competencyId: item,
          })),
        },
        ...(payload.photo !== '' ? { photo: payload.photo } : undefined),
      },
    })
    return data
  }
  update = async (id: number, payload: Partial<Employee>) => {
    await this.isExist(id)
    await db.employee.update({
      data: {
        fullname: payload.fullname,
        joined_at: payload.joined_at,
        joined_type: payload.joined_type,
        basic_salary: payload.basic_salary,
        overtime_salary: payload.overtime_salary,
        pay_type: payload.pay_type,
        employment_type: payload.employment_type,
        place_of_birth: payload.place_of_birth,
        birthdate: payload.birthdate,
        gender: payload.gender,
        marital_status: payload.marital_status,
        religion: payload.religion,
        positionId: payload.positionId,
        ...(payload.photo !== '' ? { photo: payload.photo } : undefined),
      },
      where: { id },
    })
  }
  updateCompentencies = async (
    id: number,
    { competencyIds }: { competencyIds: number[] }
  ) => {
    await this.isExist(id)
    const employee = await db.employee.findUnique({
      where: { id },
      include: {
        competencies: {
          include: {
            competency: true,
          },
        },
      },
    })

    const currentCompetencies = employee?.competencies.map(
      (item) => item.competency.id
    )

    const competenciesToConnect = competencyIds.filter(
      (item) => !currentCompetencies?.includes(item)
    )

    const competenciesToDisconnect = currentCompetencies?.filter(
      (item) => !competencyIds.includes(item)
    )

    await db.employee.update({
      where: { id },
      data: {
        competencies: {
          deleteMany: {
            competencyId: {
              in: competenciesToDisconnect,
            },
          },
          create: competenciesToConnect.map((competencyId) => ({
            competencyId,
          })),
        },
      },
    })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.employee.delete({ where: { id } })
  }
  read = async (id: number) => {
    await this.isExist(id)
    const data = await db.employee.findUnique({
      select: {
        id: true,
        fullname: true,
        addresses: true,
        attendances: true,
        cashAdvances: true,
        contacts: true,
        position: {
          select: {
            name: true,
            description: true,
          },
        },
      },
      where: { id },
    })
    return data
  }
  readAll = async (
    page: number = 1,
    limit: number = 10,
    filter?: FilterEmployee
  ) => {
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
      select: {
        fullname: true,
        id: true,
        status: true,
      },
    })

    const total = await db.employee.count({ where })
    return { data, total, page, limit }
  }

  // ADDRESS
  createAddress = async (employeeId: number, payload: Address) => {
    await this.isExist(employeeId)
    await db.address.create({
      data: { ...payload, employeeId },
    })
  }
  updateAddress = async (id: number, payload: Address) => {
    await this.isAddressExist(id)
    await db.address.update({
      data: payload,
      where: {
        id: id,
      },
    })
  }
  deleteAddress = async (id: number) => {
    await this.isAddressExist(id)
    await db.address.delete({ where: { id } })
  }
  readAddress = async (employeeId: number, addressId?: number) => {
    if (!!addressId) {
      await this.isAddressExist(addressId)
      const data = await db.address.findUnique({
        where: { employeeId, id: addressId },
      })
      return data
    }

    const data = await db.address.findMany({
      where: {
        employeeId,
      },
    })
    return data
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
  readContact = async (employeeId: number, contactId?: number) => {
    try {
      if (!!contactId) {
        await this.isContactExist(contactId)
        const data = await db.contact.findUnique({
          where: { employeeId, id: contactId },
        })
        return data
      }
      const data = await db.contact.findMany({ where: { employeeId } })
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

  updateStatusEmployee = async (id: number, status: 'active' | 'inactive') => {
    try {
      await this.isExist(id)
      const date = new Date().toISOString()

      const data = await db.employee.findUnique({ where: { id } })
      if (status == 'active') {
        if (!!data?.status) {
          throw new Error(MESSAGE_ERROR.EMPLOYEE.STATUS.ACTIVE)
        }
      } else if (status == 'inactive' && !data?.status) {
        throw new Error(MESSAGE_ERROR.EMPLOYEE.STATUS.INACTIVE)
      }

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
      const existingCompetencies = await db.employeeCompetency.findMany({
        where: { employeeId },
        select: { competencyId: true },
      })

      const existingCompetencyIds = existingCompetencies.map(
        (ec) => ec.competencyId
      )

      // Filter competencies that not exists
      const newCompetencyIds = payload.competencyId.filter(
        (id) => !existingCompetencyIds.includes(id)
      )

      if (newCompetencyIds.length > 0) {
        await db.employeeCompetency.createMany({
          data: newCompetencyIds.map((item) => ({
            competencyId: item,
            employeeId,
          })),
        })
      }
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
  readCompetency = async (employeeId: number, id?: number) => {
    try {
      await this.isExist(employeeId)

      if (!!id) {
        await this.isCompetencyExist(id)
        const employeeCompetency = await db.employeeCompetency.findUnique({
          include: {
            competency: true,
          },
          where: { employeeId, id },
        })
        const certifications = await db.certification.findMany({
          where: {
            competencyId: {
              equals: employeeCompetency?.competency.id,
            },
          },
        })
        return {
          data: {
            competency: employeeCompetency?.competency,
            certifications,
          },
        }
      }
      const data = await db.employeeCompetency.findMany({
        include: {
          competency: true,
        },
        where: { employeeId },
      })
      return data
    } catch (error) {
      throw error
    }
  }

  // Certif
  createCertif = async (employeeId: number, payload: Certification) => {
    try {
      await db.certification.create({
        data: {
          ...payload,
          expiryDate: new Date(payload.expiryDate).toISOString(),
          issueDate: new Date(payload.issueDate).toISOString(),
          employeeId,
        },
      })
    } catch (error) {
      throw error
    }
  }
  updateCertif = async (certifId: number, payload: Certification) => {
    try {
      await db.certification.update({
        data: {
          ...payload,
          expiryDate: new Date(payload.expiryDate).toISOString(),
          issueDate: new Date(payload.issueDate).toISOString(),
        },
        where: { id: certifId },
      })
    } catch (error) {
      throw error
    }
  }
  deleteCertif = async (certifId: number) => {
    try {
      await this.isCertifExist(certifId)
      await db.certification.delete({ where: { id: certifId } })
    } catch (error) {
      throw error
    }
  }
  readCertif = async (competencyId: number, certifId?: number) => {
    try {
      if (!!certifId) {
        await this.isCertifExist(certifId)
        const data = await db.certification.findUnique({
          where: {
            competencyId,
            id: certifId,
          },
        })
        return data
      }
      const data = await db.certification.findMany({ where: { competencyId } })
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
  private isCompetencyExist = async (id: number) => {
    const data = await db.competency.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.EMPLOYEE.COMPETENCY_NOT_FOUND)
  }
  private isCertifExist = async (id: number) => {
    const data = await db.certification.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.EMPLOYEE.CERTIF_NOT_FOUND)
  }
}
