import { HttpStatusCode } from 'axios'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Certification, Competency, Employee, StatusTrack } from './schema'
import { Prisma } from '@prisma/client'
import { getPaginateParams } from '@/utils/params'
import { deleteFile } from '@/utils/file'
import { differenceInDays, format } from 'date-fns'

type Payload = Employee & {
  photoUrl?: string
  active?: boolean
  deletedAt?: string
}

export const isExist = async (id: string) => {
  const data = await db.employee.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const isCertifExist = async (id: string) => {
  const data = await db.certification.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const create = async (data: Payload) => {
  return await db.employee.create({
    data: {
      fullname: data.fullname,
      photoUrl: data.photoUrl,
      birthDate: data.birthDate,
      joinedAt: data.joinedAt,
      phone: data.phone,
      address: data.address,
      salary: data.salary,
      overtimeSalary: data.overtimeSalary,
      lastEducation: data.lastEducation,
      safetyInductionDate: data.safetyInductionDate,
    },
  })
}

export const update = async (id: string, data: Payload) => {
  return await db.employee.update({
    where: { id },
    data,
  })
}

export const destroy = async (id: string) => {
  return await db.employee.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const read = async (id: string) => {
  return await db.employee.findUnique({ where: { id } })
}

export const readAll = async (
  page?: number,
  limit?: number,
  search?: string,
  positionId?: string,
  active?: boolean,
  competencies?: string[],
) => {
  const where: Prisma.EmployeeWhereInput = {
    AND: [
      search
        ? {
            OR: [{ fullname: { contains: search } }],
          }
        : {},
      active !== undefined ? { active } : {},
      positionId !== undefined ? { positionId } : {},
      competencies && competencies.length > 0
        ? {
            competencies: {
              some: {
                competencyId: {
                  in: competencies,
                },
              },
            },
          }
        : {},
    ].filter(Boolean),
  }

  const select: Prisma.EmployeeSelect = {
    id: true,
    fullname: true,
    active: true,
    address: true,
    phone: true,
    photoUrl: true,
    createdAt: true,
    updatedAt: true,
    joinedAt: true,
    lastEducation: true,
    position: true,
    birthDate: true,
    salary: true,
    overtimeSalary: true,
    status: true,
  }

  const selectDetail: Prisma.EmployeeSelect = {
    attendances: {
      select: {
        date: true,
        id: true,
        employeeId: true,
        type: true,
      },
    },
    overtimes: {
      select: {
        id: true,
        date: true,
        note: true,
        totalHour: true,
      },
    },
    certifications: {
      select: {
        id: true,
        expiryDate: true,
        fileUrl: true,
        issueDate: true,
        name: true,
        publisher: true,
      },
    },
    projects: {
      select: {
        id: true,
        name: true,
      },
    },
  }

  if (page === undefined || limit === undefined) {
    const data = await db.employee.findMany({
      where,
      select: { ...select, ...selectDetail },
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)
  const [data, total] = await Promise.all([
    db.employee.findMany({
      skip,
      take,
      where,
      select,
      orderBy: {
        fullname: 'asc',
      },
    }),
    db.employee.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)
  return {
    data,
    total,
    page,
    limit,
    total_pages,
  }
}

export const addPhoto = async (id: string, newPhoto: string) => {
  if (newPhoto) {
    const data = await db.employee.findUnique({ where: { id } })
    if (data?.photoUrl) {
      deleteFile(data?.photoUrl)
    }
  }

  await db.employee.update({
    where: { id },
    data: {
      photoUrl: newPhoto,
    },
  })
}

export const deletePhoto = async (id: string) => {
  const data = await db.employee.findUnique({
    where: { id },
    select: {
      id: true,
      photoUrl: true,
    },
  })
  if (data?.photoUrl) {
    deleteFile(data?.photoUrl)
  }
  await db.employee.update({
    where: { id },
    data: {
      photoUrl: null,
    },
  })
}

export const updateStatus = async (
  id: string,
  { note, status }: StatusTrack,
) => {
  const date = new Date().toISOString()

  const data = await db.employee.findUnique({ where: { id } })
  if (status) {
    if (!!data?.status) {
      return throwError('Pegawai sudah aktif', HttpStatusCode.BadRequest)
    }
  } else if (!status && !data?.status) {
    return throwError('Pegawai sudah nonaktif', HttpStatusCode.BadRequest)
  }

  await db.employee.update({ data: { status }, where: { id } })
}

export const createCertification = async (
  employeeId: string,
  payload: Certification & { fileUrl?: string },
) => {
  return await db.certification.create({
    data: {
      name: payload.name,
      expiryDate: payload.expiryDate,
      issueDate: payload.issueDate,
      fileUrl: payload.fileUrl,
      employeeId,
    },
  })
}

export const updateCertification = async (
  id: string,
  payload: Certification & { fileUrl?: string },
) => {
  const data = await db.certification.findUnique({ where: { id } })
  if (payload.fileUrl && data.fileUrl) {
    await deleteFile(data.fileUrl)
  }

  return await db.certification.update({
    where: { id },
    data: {
      name: payload.name,
      expiryDate: payload.expiryDate,
      issueDate: payload.issueDate,
      fileUrl: payload.fileUrl,
    },
  })
}

export const deleteCertification = async (id: string) => {
  const data = await db.certification.findUnique({
    where: { id },
    select: {
      fileUrl: true,
      employeeId: true,
    },
  })
  if (data?.fileUrl) {
    deleteFile(data.fileUrl)
  }

  await db.certification.delete({ where: { id } })
}

export const readExpireCertificate = async (positionId?: string) => {
  const today = new Date()
  const jakartaTime = new Date(today.getTime() + 7 * 60 * 60 * 1000)
  const oneMonthFromNow = new Date(jakartaTime)
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

  const expiringCertificates = await db.certification.findMany({
    where: {
      expiryDate: {
        lte: oneMonthFromNow,
      },
      employee: {
        deletedAt: null,
      },
    },

    select: {
      name: true,
      expiryDate: true,
      employee: {
        select: {
          id: true,
          fullname: true,
          photoUrl: true,
        },
      },
    },
  })

  return expiringCertificates.map((cert) => {
    if (!cert.expiryDate) return
    const expireDate = new Date(
      new Date(cert.expiryDate).getTime() + 7 * 60 * 60 * 1000,
    )

    return {
      ...cert,
      daysUntilExpiry: differenceInDays(expireDate, jakartaTime),
    }
  })
}

export const readExpireSafety = async (positionId?: string) => {
  const today = new Date()
  const jakartaTime = new Date(today.getTime() + 7 * 60 * 60 * 1000)
  const oneMonthFromNow = new Date(jakartaTime)
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

  const expiringSafety = await db.employee.findMany({
    where: {
      safetyInductionDate: {
        lte: oneMonthFromNow,
      },
      deletedAt: null,
    },
    select: {
      id: true,
      fullname: true,
      photoUrl: true,
      safetyInductionDate: true,
    },
  })

  return expiringSafety.map((item) => {
    if (!item.safetyInductionDate) return
    const expireDate = new Date(item.safetyInductionDate)

    return {
      ...item,
      expireAt: format(expireDate, 'EEEE, d MMM yyyy'),
      daysUntilExpiry: differenceInDays(expireDate, jakartaTime),
    }
  })
}
