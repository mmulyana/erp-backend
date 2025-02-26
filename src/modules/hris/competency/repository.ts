import db from '@/lib/prisma'
import { Competency } from './schema'
import { throwError } from '@/utils/error-handler'
import { HttpStatusCode } from 'axios'
import { Prisma } from '@prisma/client'

export const create = async (payload: Competency) => {
  return await db.competency.create({
    data: {
      name: payload.name,
      color: payload.color,
    },
  })
}
export const update = async (id: string, payload: Competency) => {
  return await db.competency.update({
    where: { id },
    data: {
      name: payload.name,
      color: payload.color,
    },
  })
}
export const destroy = async (id: string) => {
  return await db.competency.delete({ where: { id } })
}
export const findAll = async (search?: string) => {
  const where: Prisma.CompetencyWhereInput = {
    AND: [
      search
        ? {
            name: { contains: search },
          }
        : {},
    ],
  }
  const data = await db.competency.findMany({ where })
  return { data }
}
export const findOne = async (id: string) => {
  const data = await db.competency.findUnique({ where: { id } })
  return { data }
}
export const isExist = async (id: string) => {
  const data = await db.competency.findUnique({ where: { id } })
  if (!data) {
    return throwError('Kompetensi tidak ditemukan', HttpStatusCode.BadRequest)
  }
}
