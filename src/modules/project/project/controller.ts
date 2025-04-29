import { Request, Response } from 'express'

import { AssignedSchema, ProjectSchema, StatusSchema } from './schema'
import {
  create,
  createAssign,
  destroy,
  destroyAssign,
  isExist,
  isExistAssign,
  read,
  readAll,
  update,
  updateAssign,
  updateStatus,
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

export const patchStatusProject = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = StatusSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await updateStatus(id, parsed.data.containrId)
  res.json(updateResponse(result, 'status proyek'))
}

export const postAssignEmployeee = async (req: Request, res: Response) => {
  const parsed = AssignedSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  await createAssign(parsed.data)
  res.json(successResponse(null, 'Penugasan pegawai'))
}

export const patchAssignEmployeee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExistAssign(id)

  const parsed = AssignedSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  await updateAssign(id, parsed.data)
  res.json(successResponse(null, 'Penugasan pegawai'))
}

export const deleteAssignEmployeee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExistAssign(id)

  await destroyAssign(id)
  res.json(deleteResponse('Penugasan pegawai'))
}
