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
  totalProject,
  update,
  updateAssign,
  updateStatus,
} from './repository'

import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { errorParse, throwError } from '@/utils/error-handler'
import { checkParamsId, getParams } from '@/utils/params'
import { Messages } from '@/utils/constant'
import { HttpStatusCode } from 'axios'

export const saveProject = async (req: Request, res: Response) => {
  const parsed = ProjectSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(createResponse(result, 'proyek baru'))
}

export const updateProject = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = ProjectSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, { ...parsed.data, createdBy: req.user.id })
  res.json(updateResponse(result, 'proyek'))
}

export const destroyProject = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('proyek'))
}

export const readProject = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = read(id)
  res.json(successResponse(result, 'proyek'))
}

export const readProjects = async (req: Request, res: Response) => {
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

export const updateStatusProject = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = StatusSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await updateStatus(id, parsed.data.containrId)
  res.json(updateResponse(result, 'status proyek'))
}

export const readTotalProject = async (req: Request, res: Response) => {
  const result = await totalProject()
  res.json(successResponse(result, 'total proyek'))
}

export const saveAssignEmployeee = async (req: Request, res: Response) => {
  const parsed = AssignedSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  await createAssign(parsed.data)
  res.json(successResponse(null, 'Penugasan pegawai'))
}
export const updateAssignEmployeee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExistAssign(id)

  const parsed = AssignedSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  await updateAssign(id, parsed.data)
  res.json(successResponse(null, 'Penugasan pegawai'))
}
export const destroyAssignEmployeee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExistAssign(id)

  await destroyAssign(id)
  res.json(deleteResponse('Penugasan pegawai'))
}
