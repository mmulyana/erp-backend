import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { isValidUUID } from '@/utils/is-valid-uuid'
import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { deleteFile } from '@/utils/file'
import db from '@/lib/prisma'

import { PaginationParams } from '@/types'

import { Certification, Employee } from './schema'

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
  if (!isValidUUID(id)) {
    throwError('ID tidak valid', HttpStatusCode.BadRequest)
  }

  const data = await db.certification.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const create = async (data: Payload) => {
  return await db.employee.create({
    data: {
      fullname: data.fullname,
      position: data.position,
      photoUrl: data.photoUrl,
      birthDate: data.birthDate,
      joinedAt: data.joinedAt,
      lastEducation: data.lastEducation,
      salary: data.salary,
      overtimeSalary: data.overtimeSalary,
      address: data.address,
      phone: data.phone,
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
  return await db.employee.findUnique({ where: { id }, select })
}

export const readAll = async (
  page?: number,
  limit?: number,
  search?: string,
  position?: string,
  active?: boolean,
) => {
  const where: Prisma.EmployeeWhereInput = {
    AND: [
      search
        ? {
            OR: [{ fullname: { contains: search } }],
          }
        : {},

      active !== undefined ? { active } : {},
      position !== undefined ? { position } : {},
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

  if (page === undefined || limit === undefined) {
    const data = await db.employee.findMany({
      where,
      select,
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
        createdAt: 'desc',
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

export const readAllInfinite = async (
  page?: number,
  limit?: number,
  search?: string,
  position?: string,
  active?: boolean,
) => {
  const where: Prisma.EmployeeWhereInput = {
    AND: [
      search
        ? {
            OR: [{ fullname: { contains: search } }],
          }
        : {},
      active !== undefined ? { active } : {},
      position !== undefined ? { position } : {},
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

  const hasNextPage = page * limit < total

  return {
    data,
    nextPage: hasNextPage ? page + 1 : undefined,
  }
}

// CERTIFICATION
export const createCertificate = async (
  employeeId: string,
  payload: Certification & { fileUrl?: string },
) => {
  return await db.certification.create({
    data: {
      employeeId,
      name: payload.name,
      fileUrl: payload.fileUrl,
      publisher: payload.publisher,
      issueDate: payload.issueDate,
      expiryDate: payload.expiryDate,
    },
  })
}

export const updateCertificate = async (
  id: string,
  payload: Certification & { fileUrl?: string; changeFile?: boolean },
) => {
  const data = await db.certification.findUnique({ where: { id } })
  if (payload.changeFile && data.fileUrl) {
    await deleteFile(data.fileUrl)
  }

  return await db.certification.update({
    where: { id },
    data: {
      name: payload.name,
      fileUrl: payload.fileUrl,
      publisher: payload.publisher,
      issueDate: payload.issueDate,
      expiryDate: payload.expiryDate,
    },
  })
}

export const destroyCertificate = async (id: string) => {
  await db.certification.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}

export const findCertificates = async ({
  search,
  page,
  limit,
}: PaginationParams) => {
  const where: Prisma.CertificationWhereInput = {
    deletedAt: null,
    name: search ? { contains: search, mode: 'insensitive' } : undefined,
  }

  const select: Prisma.CertificationSelect = {
    id: true,
    name: true,
    fileUrl: true,
    publisher: true,
    issueDate: true,
    expiryDate: true,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.certification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select,
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.certification.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select,
    }),
    db.certification.count({ where }),
  ])

  return {
    data,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  }
}

export const findCertificate = async (id: string) => {
  await isCertifExist(id)

  return db.certification.findUnique({
    where: { id },
    select: {
      expiryDate: true,
      issueDate: true,
      name: true,
      fileUrl: true,
      publisher: true,
      id: true,
    },
  })
}
