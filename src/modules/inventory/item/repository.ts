import db from '@/lib/prisma'
import { Item } from './schema'
import { Prisma } from '@prisma/client'
import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { HttpStatusCode } from 'axios'
import { checkPhotoUrl, generateStatus } from './helper'

const select: Prisma.InventorySelect = {
  id: true,
  name: true,
  description: true,
  minimum: true,
  warehouse: {
    select: {
      id: true,
      name: true,
    },
  },
  brand: {
    select: {
      id: true,
      name: true,
    },
  },
  photoUrl: true,
  totalStock: true,
  availableStock: true,
  brandId: true,
  category: true,
  unitOfMeasurement: true,
  warehouseId: true,

  updatedAt: true,
  createdAt: true,
}

export const create = async (
  payload: Item & { createdBy: string; photoUrl?: string },
) => {
  return db.inventory.create({
    data: {
      name: payload.name,
      minimum: payload.minimum,
      brandId: payload.brandId,
      warehouseId: payload.warehouseId,
      description: payload.description,
      photoUrl: payload.photoUrl,
      unitOfMeasurement: payload.unitOfMeasurement,
      category: payload.category,
    },
  })
}

export const update = async (
  id: string,
  payload: Item & { createdBy: string; photoUrl?: string | null },
) => {
  await checkPhotoUrl(id, payload.photoUrl)

  return db.inventory.update({
    where: { id },
    data: {
      name: payload.name,
      minimum: payload.minimum,
      brandId: payload.brandId,
      warehouseId: payload.warehouseId,
      description: payload.description,
      photoUrl: payload.photoUrl,
      unitOfMeasurement: payload.unitOfMeasurement,
      category: payload.category,
    },
  })
}

export const destroy = async (id: string) => {
  return db.inventory.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const read = async (id: string) => {
  const result = await db.inventory.findUnique({ where: { id }, select })
  const data = {
    ...result,
    status: generateStatus(result.totalStock, result.minimum),
  }
  return { data }
}

type readAllParams = {
  page?: number
  limit?: number
  search?: string
  infinite?: boolean
}

export const readAll = async ({
  limit,
  page,
  search,
  infinite,
}: readAllParams) => {
  const where: Prisma.InventoryWhereInput = {
    AND: [
      search
        ? {
            name: { contains: search, mode: 'insensitive' },
          }
        : {},
      {
        deletedAt: null,
      },
    ],
  }

  if (page === undefined || limit === undefined) {
    const data = await db.inventory.findMany({
      select,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return {
      data: data.map((i) => ({
        ...i,
        status: generateStatus(i.totalStock, i.minimum),
      })),
    }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.inventory.findMany({
      where,
      select,
      orderBy: {
        name: 'desc',
      },
      skip,
      take,
    }),
    db.inventory.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)
  const hasNextPage = page * limit < total

  if (infinite) {
    return {
      data: data.map((i) => ({
        ...i,
        status: generateStatus(i.totalStock, i.minimum),
      })),
      nextPage: hasNextPage ? page + 1 : undefined,
    }
  }
  return {
    data: data.map((i) => ({
      ...i,
      status: generateStatus(i.totalStock, i.minimum),
    })),
    page,
    limit,
    total_pages,
    total,
  }
}

export const isExist = async (id: string) => {
  const data = await db.inventory.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const readStatusChart = async () => {
  const result = await db.$queryRawUnsafe<any[]>(`
    SELECT
      status AS name,
      COUNT(*) AS total
    FROM (
      SELECT
        CASE
          WHEN "totalStock" > "minimum" THEN 'tersedia'
          WHEN "totalStock" <= "minimum" AND "totalStock" > 0 THEN 'hampir habis'
          WHEN "totalStock" = 0 THEN 'habis'
        END AS status
      FROM "inventories"
      WHERE "deletedAt" IS NULL
    ) AS grouped
    GROUP BY status
  `)

  const colorMap: Record<string, string> = {
    tersedia: '#47AF97',
    'hampir habis': '#EE682F',
    habis: '#D52B42',
  }

  const data = result.map((item) => ({
    name: item.name,
    total: Number(item.total),
    fill: colorMap[item.name] ?? '#a3a3a3',
  }))

  return data
}

export const readLowStock = async () => {
  const inventories = await db.inventory.findMany({
    where: {
      deletedAt: null,
      totalStock: {
        lte: db.inventory.fields.minimum,
      },
    },
    select,
  })

  return inventories.filter((item) => item.totalStock <= item.minimum)
}

export const readTotal = async () => {
  return db.inventory.count({ where: { deletedAt: null } })
}

export const findSupplierByItemId = async (itemId: string) => {
  const result = await db.$queryRawUnsafe<
    {
      supplierId: string | null
      name: string | null
      photoUrl: string | null
      stockInId: string
      date: string
    }[]
  >(
    `
    SELECT DISTINCT ON (s.id)
      s.id AS "supplierId",
      s.name AS "name",
      s."photoUrl" AS "photoUrl",
      si.id AS "stockInId",
      si.date AS "date"
    FROM "stock_in_items" AS sii
    JOIN "stock_in" AS si ON sii."stockInId" = si.id
    JOIN "suppliers" AS s ON si."supplierId" = s.id
    WHERE sii."itemId" = $1::uuid
      AND s."deletedAt" IS NULL
    ORDER BY s.id, si.date DESC
    `,
    itemId,
  )

  return result
}
