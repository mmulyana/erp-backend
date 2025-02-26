import { Request, Response, NextFunction } from 'express'
import { generateReport } from '@/utils/generate-report'
import { errorParse, throwError } from '@/utils/error-handler'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { checkParamsId, getParams } from '@/utils/params'
import { RecapSchema } from './schema'
import {
  create,
  destroy,
  findAll,
  findOne,
  getReport,
  isExist,
  update,
} from './repository'
import { HttpStatusCode } from 'axios'

const getRecapDates = (recap: any) => ({
  startDate: new Date(recap.start_date),
  endDate: new Date(recap.end_date),
})

export const saveRecapitulation = async (req: Request, res: Response) => {
  const parsed = RecapSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const data = await create(req.body)
  res.json(createResponse(data, 'Rekapan'))
}

export const updateRecapitulation = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = RecapSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const data = await update(id, parsed.data)
  res.json(updateResponse(data, 'Rekapan'))
}

export const destroyRecapitulation = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('Rekapan'))
}

export const readRecapitulations = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  let year: number | undefined = undefined
  if (req.query.year) {
    const parsedYear = Number(req.query.year)
    if (
      Number.isInteger(parsedYear) &&
      parsedYear >= 2020 &&
      parsedYear <= 2050
    ) {
      year = parsedYear
    } else {
      return throwError(
        'Year must be a valid year between 2020 and 2050',
        HttpStatusCode.BadRequest,
      )
    }
  }
  const result = await findAll(page, limit, search, year)
  res.json(successResponse(result, 'Rekapan'))
}

export const readRecapitulation = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findOne(id)
  res.json(successResponse(result, 'Rekapan'))
}

export const readReportRecapitulation = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const { page, limit } = getParams(req)

  const recap = await findOne(id)

  const { startDate, endDate } = getRecapDates(recap)
  const result = await getReport(
    startDate,
    endDate,
    page ? Number(page) : undefined,
    limit ? Number(limit) : undefined,
  )

  res.json(successResponse(result, 'Rekapitulasi'))
}

export const exportReportRecapitulation = async (
  req: Request,
  res: Response,
) => {
  const { id } = checkParamsId(req)
  const { page, limit } = getParams(req)

  const recap = await findOne(id)

  const { startDate, endDate } = getRecapDates(recap)
  const data = await getReport(
    startDate,
    endDate,
    page ? Number(page) : undefined,
    limit ? Number(limit) : undefined,
  )

  await generateReport({ data: data.data, dates: data.dates }, res)
}
