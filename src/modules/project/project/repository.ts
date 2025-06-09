import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import db from '@/lib/prisma'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'

import { Assigned, Attachment, Project, Report } from './schema'
import { DateRangeParams, PaginationParams } from '@/types'
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  formatISO,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'

type Payload = Project

const select: Prisma.ProjectSelect = {
  id: true,
  name: true,
  description: true,
  attachments: true,
  priority: true,
  doneAt: true,
  deadlineAt: true,
  status: true,
  leadId: true,
  clientId: true,
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

const selectReport: Prisma.ProjectReportSelect = {
  id: true,
  _count: {
    select: {
      attachments: true,
      comments: true,
    },
  },
  attachments: true,
  createdBy: true,
  createdAt: true,
  message: true,
  type: true,
  project: {
    select: {
      name: true,
      id: true,
    },
  },
  projectId: true,
  user: {
    select: {
      id: true,
      username: true,
      photoUrl: true,
    },
  },
}

export const isExist = async (id: string) => {
  const data = await db.project.findUnique({ where: { id, deletedAt: null } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const isAssignExist = async (id: string) => {
  const data = await db.assignedEmployee.findUnique({
    where: { id, deletedAt: null },
  })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}
export const isAttachmentExist = async (id: string) => {
  const data = await db.projectAttachment.findUnique({
    where: { id, deletedAt: null },
  })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}
export const isReportExist = async (id: string) => {
  const data = await db.projectReport.findUnique({
    where: { id, deletedAt: null },
  })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const create = async (payload: Payload) => {
  const data = await db.project.create({
    data: {
      name: payload.name,
      netValue: payload.netValue || 0,
      leadId: payload.leadId,
      description: payload.description,
      clientId: payload.clientId,
      paymentPercentage: payload.paymentPercentage || 0,
      progressPercentage: payload.progressPercentage || 0,
      priority: payload.priority,
      status: payload.status,
      employees: {
        createMany: {
          data:
            payload.employeeIds && payload.employeeIds.length > 0
              ? payload.employeeIds.map((employeeId) => ({
                  employeeId,
                  startDate: new Date(),
                }))
              : [],
        },
      },
    },
  })

  return data
}

export const destroy = async (id: string) => {
  await db.project.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const update = async (id: string, payload: Payload) => {
  const data = await db.project.update({
    where: { id: id },
    data: {
      name: payload.name,
      netValue: payload.netValue,
      leadId: payload.leadId,
      description: payload.description,
      clientId: payload.clientId,
      progressPercentage: payload.progressPercentage,
      paymentPercentage: payload.paymentPercentage,
      deadlineAt: payload.deadlineAt,
      doneAt: payload.doneAt,
      status: payload.status,
      priority: payload.priority,
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
  infinite,
  sortBy,
  sortOrder,
  priority,
}: PaginationParams & {
  clientId?: string
  priority?: any
  leadId?: string
  status?: string
  infinite?: boolean
  sortBy?: 'createdAt' | 'doneAt'
  sortOrder?: 'asc' | 'desc'
}) => {
  const where: Prisma.ProjectWhereInput = {
    AND: [
      search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }] }
        : {},
      leadId ? { leadId } : {},
      clientId ? { clientId } : {},
      priority ? { priority } : {},
      status ? { status: status as any } : {},
    ],
  }

  const orderBy: Prisma.ProjectOrderByWithRelationInput = {
    [sortBy ?? 'createdAt']: sortOrder ?? 'desc',
  }

  if (page === undefined || limit === undefined) {
    const data = await db.project.findMany({
      where,
      select,
      orderBy,
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
      orderBy,
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

export const readAssign = async (projectId: string) => {
  const data = await db.assignedEmployee.findMany({
    where: { projectId, deletedAt: null },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      employee: {
        select: {
          id: true,
          fullname: true,
          photoUrl: true,
          position: true,
          salary: true,
        },
      },
    },
  })
  return data
}

export const createAssign = async (payload: Assigned) => {
  const isExist = await db.assignedEmployee.findFirst({
    where: {
      projectId: payload.projectId,
      employeeId: payload.employeeId,
      endDate: null,
      deletedAt: null,
    },
  })

  if (isExist) {
    return throwError(
      'Pegawai ini sudah ditambahkan, silangkah akhiri atau hapus data sebelumya',
      HttpStatusCode.BadRequest,
    )
  }

  await db.assignedEmployee.create({
    data: {
      projectId: payload.projectId,
      employeeId: payload.employeeId,
      startDate: payload.startDate ? new Date(payload.startDate) : new Date(),
    },
  })
}

export const updateAssign = async (id: string, payload: Assigned) => {
  return await db.assignedEmployee.update({
    where: { id },
    data: {
      projectId: payload.projectId,
      employeeId: payload.employeeId,
      startDate: new Date(payload.startDate),
      endDate: payload.endDate || null,
    },
  })
}

export const destroyAssign = async (id: string) => {
  await db.assignedEmployee.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  })
}

// Attachment
export const readAttachments = async (projectId: string, search?: string) => {
  const data = await db.projectAttachment.findMany({
    where: {
      AND: [
        { projectId, deletedAt: null },
        search
          ? {
              name: { contains: search, mode: 'insensitive' },
            }
          : {},
      ],
    },
  })
  return data
}

export const createAttachment = async (
  payload: Attachment & {
    fileUrl: string
    createdBy: string
  },
) => {
  // console.log('data', payload)
  const data = await db.projectAttachment.create({
    data: {
      projectId: payload.projectId,
      name: payload.name,
      type: payload.type,
      fileUrl: payload.fileUrl,
      createdBy: payload.createdBy,
      secret: payload.secret,
    },
  })

  return data
}

export const updateAttachment = async (
  id: string,
  payload: Attachment & {
    fileUrl: string
    createdBy: string
  },
) => {
  const data = await db.projectAttachment.update({
    data: {
      name: payload.name,
      type: payload.type,
      fileUrl: payload.fileUrl,
      createdBy: payload.createdBy,
    },
    where: { id },
  })

  return data
}

export const destroyAttachment = async (id: string) => {
  const data = await db.projectAttachment.update({
    data: {
      deletedAt: new Date(),
    },
    where: { id },
  })

  return data
}

type ReadProjectAttachmentParams = PaginationParams & {
  type?: string
  projectId?: string
  infinite?: boolean
}

export const readAllProjectAttachments = async ({
  page,
  limit,
  search,
  type,
  projectId,
  infinite,
}: ReadProjectAttachmentParams) => {
  const where: Prisma.ProjectAttachmentWhereInput = {
    AND: [
      {
        deletedAt: null,
      },
      search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {},
      type
        ? {
            type: {
              equals: type,
              mode: 'insensitive',
            },
          }
        : {},
      projectId
        ? {
            projectId,
          }
        : {},
    ],
  }

  const orderBy: Prisma.ProjectAttachmentOrderByWithRelationInput = {
    createdAt: 'desc',
  }

  const select: Prisma.ProjectAttachmentSelect = {
    id: true,
    name: true,
    type: true,
    projectId: true,
    createdAt: true,
    updatedAt: true,
    fileUrl: true,
    secret: true,
    project: {
      select: {
        name: true,
        id: true,
      },
    },
  }

  if (page === undefined || limit === undefined) {
    const data = await db.projectAttachment.findMany({
      where,
      select,
      orderBy,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.projectAttachment.findMany({
      where,
      select,
      orderBy,
      skip,
      take,
    }),
    db.projectAttachment.count({ where }),
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

export const createReport = async (
  payload: Report & { createdBy: string; attachments?: string[] },
) => {
  const data = await db.projectReport.create({
    data: {
      message: payload.message,
      type: payload.type,
      projectId: payload.projectId,
      createdBy: payload.createdBy,
      attachments: {
        create: payload.attachments.map((i) => ({
          photoUrl: i,
        })),
      },
    },
  })
  return data
}

export const updateReport = async (
  payload: Partial<Report> & {
    id: string
    deleteAttachments?: string[]
    attachments?: string[]
  },
) => {
  const updated = await db.projectReport.update({
    where: { id: payload.id },
    data: {
      message: payload.message,
      type: payload.type,
      projectId: payload.projectId,
      attachments: {
        deleteMany: {
          id: {
            in: payload.deleteAttachments || [],
          },
        },
        create: payload.attachments?.map((url) => ({
          photoUrl: url,
        })),
      },
    },
  })

  return updated
}

export const readAllProjectReports = async ({
  page,
  limit,
  search,
  type,
  projectId,
  createdBy,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  infinite,
}: PaginationParams & {
  type?: string
  projectId?: string
  createdBy?: string
  sortBy?: 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  infinite?: boolean
}) => {
  const where: Prisma.ProjectReportWhereInput = {
    AND: [
      // search
      //   ? {
      //       OR: [
      //         {
      //           message: { contains: search, mode: 'insensitive' },
      //         },
      //       ],
      //     }
      //   : {},
      type ? { type } : {},
      projectId ? { projectId } : {},
      createdBy ? { createdBy } : {},
    ],
  }

  const orderBy: Prisma.ProjectReportOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  }

  const { skip, take } = getPaginateParams(page, limit)
  if (page === undefined || limit === undefined) {
    const data = await db.projectReport.findMany({
      where,
      orderBy,
      select: selectReport,
      take,
    })
    return { data }
  }

  const [data, total] = await Promise.all([
    db.projectReport.findMany({
      where,
      orderBy,
      skip,
      take,
      select: selectReport,
    }),
    db.projectReport.count({ where }),
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
    page,
    limit,
    total,
    total_pages,
  }
}

export const readProjectReportChart = async ({
  startDate,
  endDate,
}: DateRangeParams) => {
  const today = new Date()
  const start = startDate
    ? startOfDay(new Date(startDate))
    : startOfDay(subDays(today, 6))
  const end = endDate ? endOfDay(new Date(endDate)) : endOfDay(today)

  const allDates = eachDayOfInterval({ start, end })

  const raw = await db.projectReport.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
      deletedAt: null,
    },
    select: {
      createdAt: true,
    },
  })

  const map = new Map<string, number>()

  for (const item of raw) {
    const key = formatISO(item.createdAt, { representation: 'date' })
    map.set(key, (map.get(key) ?? 0) + 1)
  }

  const result = allDates.map((date) => {
    const key = formatISO(date, { representation: 'date' })
    return {
      date: key,
      total: map.get(key) ?? 0,
    }
  })

  return result
}

export const readProjectStatusChart = async ({
  year,
  monthIndex,
}: {
  year?: number
  monthIndex?: number
}) => {
  const today = new Date()
  const y = year ?? today.getFullYear()

  let start: Date
  let end: Date

  if (monthIndex !== undefined) {
    start = startOfMonth(new Date(y, monthIndex))
    end = endOfMonth(new Date(y, monthIndex))
  } else {
    start = new Date(y, 0, 1)
    end = new Date(y, 11, 31, 23, 59, 59, 999)
  }

  const raw = await db.project.groupBy({
    by: ['status'],
    where: {
      deletedAt: null,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    _count: {
      _all: true,
    },
  })

  const statusMap: Record<string, { name: string; fill: string }> = {
    OFFERING: { name: 'Penawaran', fill: '#D52B61' },
    DOING: { name: 'Sedang dikerjakan', fill: '#2B5BD5' },
    BILLING: { name: 'Penagihan', fill: '#27B5E9' },
    DONE: { name: 'Selesai', fill: '#47AF97' },
    NOT_STARTED: { name: 'Blm dimulai', fill: '#565659' },
  }

  const chartData = raw.map((item) => ({
    name: statusMap[item.status]?.name || item.status,
    total: item._count._all,
    fill: statusMap[item.status]?.fill || '#CCCCCC',
  }))

  return chartData
}

export const readTotalRevenue = async ({
  year,
  monthIndex,
}: {
  year?: number
  monthIndex?: number
}) => {
  const today = new Date()

  const y = year ?? today.getFullYear()
  const m = monthIndex ?? today.getMonth()

  const currentDate = new Date(y, m)
  const prevDate = subMonths(currentDate, 1)

  const start = startOfMonth(currentDate)
  const end = endOfMonth(currentDate)
  const prevStart = startOfMonth(prevDate)
  const prevEnd = endOfMonth(prevDate)

  const buildWhere = (start: Date, end: Date) => {
    const where: any = {
      deletedAt: null,
      createdAt: {
        gte: start,
        lte: end,
      },
    }

    where.status = 'DONE'

    return where
  }

  const [currentAgg, previousAgg] = await Promise.all([
    db.project.aggregate({
      _sum: { netValue: true },
      where: buildWhere(start, end),
    }),
    typeof year === 'number' && typeof monthIndex === 'number'
      ? db.project.aggregate({
          _sum: { netValue: true },
          where: buildWhere(prevStart, prevEnd),
        })
      : Promise.resolve({ _sum: { netValue: null } }),
  ])

  const currentRaw = currentAgg._sum.netValue ?? 0
  const previousRaw = previousAgg._sum.netValue ?? 0

  const current =
    typeof currentRaw === 'bigint' ? Number(currentRaw) : currentRaw
  const previous =
    typeof previousRaw === 'bigint' ? Number(previousRaw) : previousRaw

  const percentage =
    previous === 0
      ? current === 0
        ? 0
        : 100
      : ((current - previous) / previous) * 100

  return {
    current,
    previous,
    percentage: Math.round(percentage * 100) / 100,
  }
}

export const readEstimateRevenue = async () => {
  const result = await db.project.aggregate({
    _sum: { netValue: true },
    where: {
      deletedAt: null,
      status: {
        not: 'DONE',
      },
    },
  })

  const raw = result._sum.netValue ?? 0
  const total = typeof raw === 'bigint' ? Number(raw) : raw

  return {
    total,
  }
}

export const readReportById = async (id: string) => {
  return await db.projectReport.findUnique({
    where: { id },
    select: selectReport,
  })
}

export const readAssigned = async (id: string) => {
  const data = await db.assignedEmployee.findUnique({
    where: { id },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      employeeId: true,
    },
  })
  return data
}

export const readAssignedCost = async (projectId: string) => {
  const assignments = await db.assignedEmployee.findMany({
    where: { projectId, deletedAt: null },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      employee: {
        select: {
          id: true,
          fullname: true,
          photoUrl: true,
          position: true,
          salary: true,
        },
      },
    },
  })

  const today = new Date()

  const computed = assignments.map((item) => {
    const start = new Date(item.startDate)
    const end = item.endDate ? new Date(item.endDate) : today
    const days = differenceInCalendarDays(end, start) + 1
    const cost = item.employee.salary ? days * item.employee.salary : 0

    return {
      ...item,
      days,
      cost,
    }
  })

  const totalCost = computed.reduce((sum, item) => sum + item.cost, 0)

  return {
    data: computed,
    totalCost,
  }
}
