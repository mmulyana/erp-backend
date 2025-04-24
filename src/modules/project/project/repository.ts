import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import db from '@/lib/prisma'

import { generateUUID } from '@/utils/generate-uuid'
import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'

import { Assigned, Project } from './schema'

type Payload = Project

const select: Prisma.ProjectSelect = {
  id: true,
  name: true,
  description: true,
  archivedAt: true,
  attachments: true,
  boardItems: true,
  client: {
    select: {
      id: true,
      name: true,
    },
  },
  lead: {
    select: {
      id: true,
      username: true,
    },
  },
  endedAt: true,
  startedAt: true,
  netValue: true,
  progressPercentage: true,
  paymentPercentage: true,
  employees: {
    where: {
      endDate: null,
    },
  },
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}

type Params = {
  page?: number
  limit?: number
  search?: string
  clientId?: string
  leadId?: string
  status?: string
  startedAt?: string
  endedAt?: string
  archivedAt?: string
  netValue?: number
  progress?: {
    percentage?: number
    option: '==' | '<=' | '>='
  }
  payment?: {
    percentage?: number
    option: '==' | '<=' | '>='
  }
  infinite?: boolean
}

export const isExist = async (id: string) => {
  const data = await db.project.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const isExistAssign = async (id: string) => {
  const data = await db.assignedEmployee.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const create = async (payload: Payload) => {
  const container = await db.boardContainer.findMany()
  const lastItem = await db.boardItems.findFirst({
    where: {
      containerId: container[0].id,
    },
    orderBy: {
      position: 'desc',
    },
  })
  const position = lastItem ? lastItem.position + 1 : 0
  const id = `item-${generateUUID()}`
  await db.boardItems.create({
    data: { id, position, containerId: container[0].id },
  })

  const data = await db.project.create({
    data: {
      boardItemsId: id,
      name: payload.name,
      startedAt: payload.startedAt,
      endedAt: payload.endedAt,
      netValue: payload.netValue,
      leadId: payload.leadId,
      description: payload.description,
      clientId: payload.clientId,
      paymentPercentage: payload.paymentPercentage || 0,
      progressPercentage: payload.progressPercentage || 0,
    },
  })

  return data
}

export const destroy = async (id: string) => {
  const project = await db.project.findUnique({ where: { id } })
  await db.project.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
  await db.boardItems.delete({ where: { id: project?.boardItemsId } })
}

export const update = async (id: string, payload: Payload) => {
  const data = await db.project.update({
    where: { id: id },
    data: {
      name: payload.name,
      startedAt: payload.startedAt,
      endedAt: payload.endedAt,
      netValue: payload.netValue,
      leadId: payload.leadId,
      description: payload.description,
      clientId: payload.clientId,
      progressPercentage: payload.progressPercentage,
      paymentPercentage: payload.paymentPercentage,
    },
    select: {
      id: true,
    },
  })

  return { data }
}

export const read = async (id: string) => {
  return await db.project.findUnique({ where: { id }, select })
}

export const readAll = async ({
  page,
  limit,
  search,
  clientId,
  leadId,
  status,
  startedAt,
  endedAt,
  archivedAt,
  netValue,
  progress,
  payment,
  infinite,
}: Params) => {
  const where: Prisma.ProjectWhereInput = {
    AND: [
      search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }] }
        : {},
      leadId ? { leadId } : {},
      clientId ? { clientId } : {},
      netValue ? { netValue } : {},
      startedAt ? { startedAt: { gte: new Date(startedAt) } } : {},
      endedAt ? { endedAt: { lte: new Date(endedAt) } } : {},
      archivedAt ? { archivedAt: { equals: new Date(archivedAt) } } : {},
      status !== undefined
        ? {
            boardItems: {
              container: {
                name: {
                  equals: status,
                },
              },
            },
          }
        : {},

      progress?.percentage !== undefined
        ? {
            progressPercentage:
              progress.option === '=='
                ? { equals: progress.percentage }
                : progress.option === '<='
                  ? { lte: progress.percentage }
                  : progress.option === '>='
                    ? { gte: progress.percentage }
                    : {},
          }
        : {},

      payment?.percentage !== undefined
        ? {
            paymentPercentage:
              payment.option === '=='
                ? { equals: payment.percentage }
                : payment.option === '<='
                  ? { lte: payment.percentage }
                  : payment.option === '>='
                    ? { gte: payment.percentage }
                    : {},
          }
        : {},
    ],
  }

  if (page === undefined || limit === undefined) {
    const data = await db.project.findMany({
      where,
      select,
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.project.findMany({
      skip,
      take,
      where,
      select,
      orderBy: {
        updatedAt: 'asc',
      },
    }),
    db.project.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)
  const hasNextPage = page * limit < total

  if (infinite) {
    return {
      data,
      nextPage: hasNextPage ? page + 1 : undefined,
    }
  }

  return {
    data,
    total,
    page,
    limit,
    total_pages,
  }
}

export const updateStatus = async (id: string, containerId: string) => {
  const data = await db.project.findUnique({
    where: { id },
    select: {
      boardItems: {
        select: {
          id: true,
          containerId: true,
        },
      },
      id: true,
    },
  })

  const boardItem = await db.boardItems.findMany({
    where: { containerId },
    take: 1,
    orderBy: {
      position: 'desc',
    },
  })

  await db.boardItems.update({
    data: {
      position: !!boardItem.length ? boardItem[0].position + 1 : 0,
      containerId: containerId,
    },
    where: { id: data?.boardItems.id },
  })

  return { data }
}

export const totalProject = async () => {
  const active = await db.project.count({
    where: {
      archivedAt: null,
      deletedAt: null,
      endedAt: null,
    },
  })
  const done = await db.project.count({
    where: {
      deletedAt: null,
      endedAt: {
        not: null,
      },
    },
  })

  return { active, done }
}

export const createAssign = async (payload: Assigned) => {
  await db.assignedEmployee.create({
    data: {
      projectId: payload.projectId,
      employeeId: payload.employeeId,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
    },
  })
}

export const updateAssign = async (id: string, payload: Assigned) => {
  await db.assignedEmployee.update({
    where: { id },
    data: {
      projectId: payload.projectId,
      employeeId: payload.employeeId,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
    },
  })
}

export const destroyAssign = async (id: string) => {
  await db.assignedEmployee.delete({
    where: {
      id,
    },
  })
}
