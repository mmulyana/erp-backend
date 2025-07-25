import { Request, Response } from 'express'

import {
  AssignedSchema,
  AttachmentSchema,
  ProjectSchema,
  ReportSchema,
} from './schema'
import {
  create,
  createAssign,
  createAttachment,
  createReport,
  destroy,
  destroyAssign,
  destroyAttachment,
  isExist,
  isAssignExist,
  isAttachmentExist,
  isReportExist,
  read,
  readAll,
  readAllProjectAttachments,
  readAllProjectReports,
  readAssign,
  readAttachments,
  readEstimateRevenue,
  readProjectReportChart,
  readProjectStatusChart,
  readReportById,
  readTotalRevenue,
  update,
  updateAssign,
  updateAttachment,
  updateReport,
  readAssigned,
  readAssignedCost,
} from './repository'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { getQueryParam } from '@/utils'
import { z } from 'zod'

export const postProject = async (req: Request, res: Response) => {
  const parsed = ProjectSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const result = await create(parsed.data)
  res.json(createResponse(result, 'proyek baru'))
}

export const patchProject = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = ProjectSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'proyek'))
}

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('proyek'))
}

export const getProject = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'proyek'))
}

export const getProjects = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = getParams(req)
  const clientId = getQueryParam(req.query, 'clientId', 'string')
  const leadId = getQueryParam(req.query, 'leadId', 'string')
  const status = getQueryParam(req.query, 'status', 'string')
  const priority = getQueryParam(req.query, 'priority', 'string')

  const result = await readAll({
    page,
    limit,
    search,
    clientId,
    leadId,
    status,
    sortBy,
    sortOrder,
    priority,
  })

  res.json(successResponse(result, 'proyek'))
}

export const getProjectsInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const result = await readAll({
    page,
    limit,
    search,
    infinite: true,
  })

  res.json(successResponse(result, 'proyek'))
}

export const postAssignEmployee = async (req: Request, res: Response) => {
  const parsed = AssignedSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  await createAssign(parsed.data)
  res.json(successResponse(null, 'Penugasan pegawai'))
}

export const patchAssignEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isAssignExist(id)

  const parsed = AssignedSchema.partial()
    .extend({ id: z.string().optional() })
    .safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await updateAssign(id, parsed.data)
  res.json(successResponse(result, 'Penugasan pegawai'))
}

export const deleteAssignEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isAssignExist(id)

  await destroyAssign(id)
  res.json(deleteResponse('Penugasan pegawai'))
}

export const getAssignedEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await readAssign(id)
  res.json(successResponse(result, 'Penugasan pegawai'))
}

// attachment
export const getAttachments = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const { search } = getParams(req)

  const result = await readAttachments(id, search)
  res.json(successResponse(result, 'lampiran'))
}

export const postAttachment = async (req: Request, res: Response) => {
  // console.log('body', req.body)
  const parsed = AttachmentSchema.safeParse(req.body)
  // console.log(parsed.error)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const fileUrl = req?.file?.filename || undefined
  const createdBy = req.user.id

  const result = await createAttachment({
    ...parsed.data,
    fileUrl,
    createdBy,
  })

  res.json(createResponse(result, 'lampiran'))
}

export const patchAttachment = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isAttachmentExist(id)

  const parsed = AttachmentSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const fileUrl = req?.file?.filename || undefined
  const createdBy = req.user.id

  const result = await updateAttachment(id, {
    ...parsed.data,
    fileUrl,
    createdBy,
  })

  res.json(updateResponse(result, 'lampiran'))
}

export const deleteAttachment = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isAttachmentExist(id)

  await destroyAttachment(id)
  res.json(deleteResponse('lampiran'))
}

export const getProjectAttachments = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const projectId = getQueryParam(req.query, 'projectId', 'string')
  const type = getQueryParam(req.query, 'type', 'string')
  const infinite = getQueryParam(req.query, 'infinite', 'boolean')

  const allowSecret = req.user.permissions.includes(
    'project:read-secret-attachment',
  )

  const result = await readAllProjectAttachments({
    page,
    limit,
    search,
    projectId,
    type,
    infinite,
    allowSecret,
  })
  res.json(successResponse(result, 'Lampiran'))
}

export const postReport = async (req: Request, res: Response) => {
  const parsed = ReportSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const files = req.files as Express.Multer.File[] | undefined
  const attachments = files?.map((i) => i.filename) || []

  const result = await createReport({
    ...parsed.data,
    createdBy: req.user.id,
    attachments,
  })

  res.json(createResponse(result, 'Laporan'))
}

export const patchReport = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isReportExist(id)

  if (
    req.body.deleteAttachments &&
    !Array.isArray(req.body.deleteAttachments)
  ) {
    req.body.deleteAttachments = [req.body.deleteAttachments]
  }
  const parsed = ReportSchema.extend({
    deleteAttachments: z.string().array().optional(),
  })
    .partial()
    .safeParse(req.body)

  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const files = req.files as Express.Multer.File[] | undefined
  const attachments = files?.map((i) => i.filename) || []

  const result = await updateReport({
    ...parsed.data,
    attachments,
    id,
  })

  res.json(updateResponse(result, 'Laporan'))
}

export const getReport = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isReportExist(id)

  const result = await readReportById(id)
  res.json(successResponse(result, 'Detail Laporan'))
}

export const getProjectReports = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const projectId = getQueryParam(req.query, 'projectId', 'string')
  const infinite = getQueryParam(req.query, 'infinite', 'boolean')
  const type = getQueryParam(req.query, 'type', 'string')

  const result = await readAllProjectReports({
    page,
    limit,
    search,
    projectId,
    type,
    infinite,
  })
  res.json(successResponse(result, 'Laporan'))
}

export const getProjectReportChart = async (req: Request, res: Response) => {
  const startDate = getQueryParam(req.query, 'startDate', 'string')
  const endDate = getQueryParam(req.query, 'endDate', 'string')

  const result = await readProjectReportChart({
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  })
  res.json(successResponse(result, 'Bagan laporan'))
}
export const getProjectStatusChart = async (req: Request, res: Response) => {
  const year = getQueryParam(req.query, 'year', 'number')
  const monthIndex = getQueryParam(req.query, 'month', 'number')

  const result = await readProjectStatusChart({
    year: year || new Date().getFullYear(),
    monthIndex,
  })
  res.json(successResponse(result, 'Bagan status proyek'))
}
export const getTotalNetValue = async (req: Request, res: Response) => {
  const year = getQueryParam(req.query, 'year', 'number')
  const monthIndex = getQueryParam(req.query, 'month', 'number')

  const result = await readTotalRevenue({
    year,
    monthIndex,
  })
  res.json(successResponse(result, 'Pendapatan'))
}
export const getEstimateRevenue = async (req: Request, res: Response) => {
  const result = await readEstimateRevenue()
  res.json(successResponse(result, 'Estimasi pendapatan'))
}
export const getAssigned = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  const result = await readAssigned(id)
  res.json(successResponse(result, 'penugasan'))
}
export const getAssignedCost = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  const result = await readAssignedCost(id)
  res.json(successResponse(result, 'penugasan'))
}
