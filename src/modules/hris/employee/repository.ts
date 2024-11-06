import { deleteFile, PATHS } from '../../../utils/file'
import Message from '../../../utils/constant/message'
import db from '../../../lib/db'
import {
  contactSchema,
  addressSchema,
  employeeSchema,
  competencySchema,
  certifchema,
  updateEmployeeSchema,
} from './schema'
import { z } from 'zod'

import { differenceInDays, format } from 'date-fns'

type Employee = z.infer<typeof employeeSchema>
type UpdateEmployee = z.infer<typeof updateEmployeeSchema>
type Contact = z.infer<typeof contactSchema>
type Address = z.infer<typeof addressSchema>
type Competency = z.infer<typeof competencySchema>
type Certification = z.infer<typeof certifchema>

export type FilterEmployee = {
  fullname?: string
  positionId?: number
}

export default class EmployeeRepository {
  private message: Message = new Message('pegawai')
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
        birth_date: payload.birth_date,
        gender: payload.gender,
        marital_status: payload.marital_status,
        religion: payload.religion,
        positionId: Number(payload.positionId),
        last_education: payload.last_education,
        safety_induction_date: payload.safety_induction_date,
        email: payload.email,
        addresses: {
          create: payload.addresses?.map((item) => ({
            value: item.value,
            type: item.type,
          })),
        },
        phoneNumbers: {
          create: payload.phoneNumbers?.map((item) => ({
            value: item.value,
          })),
        },
        competencies: {
          create: payload.competencies?.map((competencyId) => ({
            competency: {
              connect: { id: Number(competencyId) },
            },
          })),
        },
      },
      include: {
        competencies: {
          select: {
            competency: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
    return data
  }
  update = async (id: number, payload: UpdateEmployee) => {
    return await db.employee.update({
      data: payload,
      where: { id },
      select: {
        id: true,
      },
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
    const data = await db.employee.findUnique({ where: { id } })
    if (data?.photo) {
      deleteFile(data?.photo)
    }
    await db.employee.delete({ where: { id } })
  }
  softDelete = async (id: number) => {
    await this.isExist(id)
    await db.employee.update({
      data: {
        isHidden: true,
      },
      where: { id },
    })
  }
  read = async (id: number) => {
    await this.isExist(id)
    const data = await db.employee.findUnique({
      include: {
        _count: {
          select: {
            certifications: true,
          },
        },
        addresses: true,
        certifications: {
          include: {
            competency: {
              select: {
                name: true,
                color: true,
                id: true,
              },
            },
          },
        },
        statusTracks: true,
        phoneNumbers: true,
        competencies: {
          include: {
            competency: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
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
    const where: any = {
      isHidden: false,
    }

    if (filter) {
      if (filter.fullname) {
        where.OR = [
          { fullname: { contains: filter.fullname.toLowerCase() } },
          { fullname: { contains: filter.fullname.toUpperCase() } },
          { fullname: { contains: filter.fullname } },
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
        last_education: true,
        birth_date: true,
        photo: true,
        certifications: {
          include: {
            competency: true,
          },
        },
        competencies: {
          select: {
            competency: true,
            id: true,
          },
        },
      },
    })

    const total = await db.employee.count({ where })
    const total_pages = Math.ceil(total / limit)
    return { data, total, page, limit, total_pages }
  }

  // PHOTO
  updatePhoto = async (id: number, photo: string) => {
    await this.isExist(id)

    if (photo) {
      const data = await db.employee.findUnique({ where: { id } })
      if (data?.photo) {
        deleteFile(data?.photo)
      }
    }

    await db.employee.update({
      where: { id },
      data: {
        photo,
      },
    })
  }
  deletePhoto = async (id: number) => {
    await this.isExist(id)

    const data = await db.employee.findUnique({
      where: { id },
      select: {
        id: true,
        photo: true,
      },
    })
    if (data?.photo) {
      deleteFile(data?.photo)
    }
    return data
  }

  // ADDRESS
  createAddress = async (employeeId: number, payload: Address) => {
    await this.isExist(employeeId)
    await db.address.create({
      data: { ...payload, employeeId },
    })
    return { employeeId }
  }
  updateAddress = async (id: number, payload: Address) => {
    await this.isAddressExist(id)
    return await db.address.update({
      data: payload,
      where: {
        id: id,
      },
      select: {
        employeeId: true,
      },
    })
  }
  deleteAddress = async (id: number) => {
    await this.isAddressExist(id)
    return await db.address.delete({
      where: { id },
      select: { employeeId: true },
    })
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
    await this.isExist(employeeId)
    await db.phoneNumbers.create({ data: { ...payload, employeeId } })
    return { employeeId }
  }
  updateContact = async (id: number, payload: Contact) => {
    await this.isContactExist(id)
    return await db.phoneNumbers.update({
      data: payload,
      where: { id },
      select: { employeeId: true },
    })
  }
  deleteContact = async (id: number) => {
    await this.isContactExist(id)
    const data = await db.phoneNumbers.delete({
      where: { id },
      select: {
        employeeId: true,
      },
    })
    return data
  }
  readContact = async (employeeId: number, contactId?: number) => {
    if (!!contactId) {
      await this.isContactExist(contactId)
      const data = await db.phoneNumbers.findUnique({
        where: { employeeId, id: contactId },
      })
      return data
    }
    const data = await db.phoneNumbers.findMany({ where: { employeeId } })
    return data
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

  updateStatusEmployee = async (
    id: number,
    status: boolean,
    { description }: { description?: string }
  ) => {
    await this.isExist(id)
    const date = new Date().toISOString()

    const data = await db.employee.findUnique({ where: { id } })
    if (status) {
      if (!!data?.status) {
        throw new Error('Pegawai sudah aktif')
      }
    } else if (!status && !data?.status) {
      throw new Error('Pegawai sudah nonaktif')
    }

    await db.employee.update({ data: { status }, where: { id } })

    return await db.employeeStatusTrack.create({
      data: {
        status,
        date,
        description: description ?? null,
        employeeId: id,
      },
      select: {
        employeeId: true,
      },
    })
  }

  readEmployeeTrack = async (id: number) => {
    return await db.employeeStatusTrack.findMany({
      where: { employeeId: id },
      orderBy: { date: 'asc' },
    })
  }

  // Competency
  createCompetency = async (employeeId: number, payload: Competency) => {
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
  }
  createSingleCompetency = async (
    employeeId: number,
    payload: { competencyId: number }
  ) => {
    return await db.employeeCompetency.create({
      data: {
        competencyId: payload.competencyId,
        employeeId,
      },
      select: {
        employeeId: true,
      },
    })
  }
  // competencyId
  deleteCompetency = async (id: number) => {
    return await db.employeeCompetency.delete({
      where: { id },
      select: { employeeId: true },
    })
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
  createCertif = async (employeeId: number, payload: Certification[]) => {
    await db.certification.createMany({
      data: payload.map((item) => {
        const certifData = {
          ...item,
          competencyId:
            item.competencyId && item.competencyId !== ''
              ? Number(item.competencyId)
              : null,
          employeeId,
          expire_at: null as Date | null,
        }

        if (item.expiry_year && item.expiry_month) {
          try {
            const date = new Date(
              Number(item.expiry_year),
              Number(item.expiry_month),
              1
            )
            certifData.expire_at = date
          } catch (error) {
            certifData.expire_at = null
          }
        }

        return certifData
      }),
    })
  }
  createSingleCertif = async (employeeId: number, payload: Certification) => {
    let expire_at: null | Date = null
    if (payload.expiry_year && payload.expiry_month) {
      const date = new Date(
        Number(payload.expiry_year),
        Number(payload.expiry_month),
        1
      )
      expire_at = date
    }
    return await db.certification.create({
      data: {
        ...payload,
        competencyId: payload.competencyId
          ? Number(payload.competencyId)
          : null,
        employeeId,
        expire_at,
      },
      select: {
        employeeId: true,
      },
    })
  }
  updateCertif = async (
    certifId: number,
    payload: Certification & { certif_file: string }
  ) => {
    let expire_at: null | Date = null

    if (payload.certif_file) {
      const existing = await db.certification.findUnique({
        where: { id: certifId },
        select: { certif_file: true },
      })
      if (existing?.certif_file) {
        deleteFile(existing.certif_file, PATHS.FILES)
      }
    }

    if (payload.expiry_year && payload.expiry_month) {
      const date = new Date(
        Number(payload.expiry_year),
        Number(payload.expiry_month),
        1
      )
      expire_at = date
    }
    return await db.certification.update({
      data: {
        ...payload,
        competencyId: payload.competencyId
          ? Number(payload.competencyId)
          : null,
        ...(expire_at ? { expire_at } : undefined),
      },
      where: { id: certifId },
      select: {
        employeeId: true,
      },
    })
  }
  deleteCertif = async (certifId: number) => {
    await this.isCertifExist(certifId)
    const data = await db.certification.findUnique({
      where: { id: certifId },
      select: {
        certif_file: true,
        employeeId: true,
      },
    })
    if (data?.certif_file) {
      deleteFile(data.certif_file, PATHS.FILES)
    }

    await db.certification.delete({ where: { id: certifId } })
    return { employeeId: data?.employeeId }
  }
  readCertif = async (competencyId: number, certifId?: number) => {
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
  }

  getExpiringCertificates = async (positionId?: number) => {
    const today = new Date()
    const jakartaTime = new Date(today.getTime() + 7 * 60 * 60 * 1000)
    const oneMonthFromNow = new Date(jakartaTime)
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

    const expiringCertificates = await db.certification.findMany({
      where: {
        expire_at: {
          lte: oneMonthFromNow,
        },
        employee: {
          isHidden: false,
          positionId: positionId ?? undefined,
        },
      },

      select: {
        certif_name: true,
        expire_at: true,
        employee: {
          select: {
            id: true,
            fullname: true,
            photo: true,
          },
        },
      },
    })

    return expiringCertificates.map((cert) => {
      if (!cert.expire_at) return
      const expireDate = new Date(
        new Date(cert.expire_at).getTime() + 7 * 60 * 60 * 1000
      )

      return {
        ...cert,
        certif_name: cert.certif_name,
        daysUntilExpiry: differenceInDays(expireDate, jakartaTime),
      }
    })
  }
  getExpiringSafety = async (positionId?: number) => {
    const today = new Date()
    const jakartaTime = new Date(today.getTime() + 7 * 60 * 60 * 1000)
    const oneMonthFromNow = new Date(jakartaTime)
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

    const expiringSafety = await db.employee.findMany({
      where: {
        safety_induction_date: {
          lte: oneMonthFromNow,
        },
        isHidden: false,
        positionId: positionId ?? undefined,
      },
      select: {
        id: true,
        fullname: true,
        photo: true,
        safety_induction_date: true,
      },
    })

    return expiringSafety.map((item) => {
      if (!item.safety_induction_date) return
      const expireDate = new Date(item.safety_induction_date)

      return {
        ...item,
        expire_at: format(expireDate, 'EEEE, d MMM yyyy'),
        daysUntilExpiry: differenceInDays(expireDate, jakartaTime),
      }
    })
  }

  private isExist = async (id: number) => {
    const data = await db.employee.findUnique({ where: { id } })
    if (!data) throw Error(this.message.notfoundCustom('Pegawai'))
  }
  private isAddressExist = async (id: number) => {
    const data = await db.address.findUnique({ where: { id } })
    if (!data) throw Error(this.message.notfoundCustom('Alamat'))
  }
  private isContactExist = async (id: number) => {
    const data = await db.phoneNumbers.findUnique({ where: { id } })
    if (!data) throw Error(this.message.notfoundCustom('Nomor telp'))
  }
  private isPositionExist = async (id: number) => {
    const data = await db.position.findUnique({ where: { id } })
    if (!data) throw Error(this.message.notfoundCustom('Jabatan'))
  }
  private isCompetencyExist = async (id: number) => {
    const data = await db.competency.findUnique({ where: { id } })
    if (!data) throw Error(this.message.notfoundCustom('Kompetensi'))
  }
  private isCertifExist = async (id: number) => {
    const data = await db.certification.findUnique({ where: { id } })
    if (!data) throw Error(this.message.notfoundCustom('Sertifikat'))
  }
}
