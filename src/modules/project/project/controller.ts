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
  isExistAssign,
  isExistAttachment,
  read,
  readAll,
  readAllProjectAttachments,
  readAllProjectReports,
  readAssign,
  readAttachments,
  readEstimateRevenue,
  readProjectReportChart,
  readProjectStatusChart,
  readTotalRevenue,
  update,
  updateAssign,
  updateAttachment,
} from './repository'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

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
  const { page, limit, search } = getParams(req)
  const clientId = req.params.clientId ? String(req.params.clientId) : undefined
  const leadId = req.params.leadId ? String(req.params.leadId) : undefined
  const status = req.params.status ? String(req.params.status) : undefined
  const startedAt = req.params.startedAt
    ? String(req.params.startedAt)
    : undefined
  const endedAt = req.params.endedAt ? String(req.params.endedAt) : undefined
  const archivedAt = req.params.archivedAt
    ? String(req.params.archivedAt)
    : undefined
  const netValue = req.params.netValue ? Number(req.params.netValue) : undefined
  const progressPercentage = req.params.progressPercentage
    ? Number(req.params.progressPercentage)
    : undefined
  const progressOption = req.params.progressOption
    ? String(req.params.progressOption)
    : undefined
  const paymentPercentage = req.params.paymentPercentage
    ? Number(req.params.paymentPercentage)
    : undefined
  const paymentOption = req.params.paymentOption
    ? String(req.params.paymentOption)
    : undefined

  const result = await readAll({
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
    progress: {
      percentage: progressPercentage,
      option: progressOption as any,
    },
    payment: {
      percentage: paymentPercentage,
      option: paymentOption as any,
    },
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
  await isExistAssign(id)

  const parsed = AssignedSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  await updateAssign(id, parsed.data)
  res.json(successResponse(null, 'Penugasan pegawai'))
}

export const deleteAssignEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExistAssign(id)

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
  await isExistAttachment(id)

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
  await isExistAttachment(id)

  await destroyAttachment(id)
  res.json(deleteResponse('lampiran'))
}

export const getProjectAttachments = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const projectId = req.query.projectId
    ? String(req.query.projectId)
    : undefined
  const type = req.query.type ? String(req.query.type) : undefined
  const infinite = req.query.infinite ? Boolean(req.query.infinite) : undefined

  const result = await readAllProjectAttachments({
    page,
    limit,
    search,
    projectId,
    type,
    infinite,
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

export const getProjectReports = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const projectId = req.query.projectId
    ? String(req.query.projectId)
    : undefined
  const type = req.query.type ? String(req.query.type) : undefined
  const infinite = req.query.infinite ? Boolean(req.query.infinite) : undefined

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
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined
  const result = await readProjectReportChart({
    startDate,
    endDate,
  })
  res.json(successResponse(result, 'Bagan laporan'))
}
export const getProjectStatusChart = async (req: Request, res: Response) => {
  const year = req.query.year ? Number(req.query.year as string) : undefined
  const monthIndex = req.query.month
    ? Number(req.query.month as string)
    : undefined
  const result = await readProjectStatusChart({
    year,
    monthIndex,
  })
  res.json(successResponse(result, 'Bagan status proyek'))
}
export const getTotalNetValue = async (req: Request, res: Response) => {
  const year = req.query.year ? Number(req.query.year as string) : undefined
  const monthIndex = req.query.month
    ? Number(req.query.month as string)
    : undefined
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
