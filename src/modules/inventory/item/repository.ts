import db from '@/lib/prisma'
import { Item } from './schema'
import { Prisma } from '@prisma/client'
import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { HttpStatusCode } from 'axios'
import { checkPhotoUrl, generateStatus } from './helper'
import { PaginationParams } from '@/types'

const select: Prisma.InventorySelect = {
  id: true,
  name: true,
  description: true,
  minimum: true,
  warehouse: {
    select: {
      id: true,
      name: true,
      deletedAt: true,
    },
  },
  brand: {
    select: {
      id: true,
      name: true,
      deletedAt: true,
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
      type: payload.type,
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
      type: payload.type,
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
  return data
}

export const readAll = async ({
  limit,
  page,
  search,
  infinite,
  brandId,
  warehouseId,
  sortBy,
  sortOrder,
  status,
  type,
}: PaginationParams & {
  infinite?: boolean
  brandId?: string
  warehouseId?: string
  sortBy?: string
  sortOrder?: string
  status?: 'OutOfStock' | 'LowStock' | 'Available'
  type?: string
}) => {
  const orderField = sortBy || 'createdAt'
  const orderDirection = sortOrder === 'asc' ? 'ASC' : 'DESC'
  const { skip, take } = getPaginateParams(page, limit)

  let paramIndex = 1
  const params: any[] = []

  let whereClause = `WHERE inventories."deletedAt" IS NULL`

  if (search) {
    whereClause += ` AND inventories."name" ILIKE '%' || $${paramIndex} || '%'`
    params.push(search)
    paramIndex++
  }

  if (brandId) {
    whereClause += ` AND inventories."brandId" = $${paramIndex}::uuid`
    params.push(brandId)
    paramIndex++
  }

  if (warehouseId) {
    whereClause += ` AND inventories."warehouseId" = $${paramIndex}::uuid`
    params.push(warehouseId)
    paramIndex++
  }
  if (type) {
    whereClause += ` AND inventories."type" = $${paramIndex}`
    params.push(type)
    paramIndex++
  }

  if (status) {
    whereClause += ` AND (
      CASE
        WHEN inventories."totalStock" = 0 THEN 'OutOfStock'
        WHEN inventories."totalStock" <= inventories."minimum" AND inventories."totalStock" > 0 THEN 'LowStock'
        ELSE 'Available'
      END = $${paramIndex}
    )`
    params.push(status)
    paramIndex++
  }

  params.push(take)
  params.push(skip)

  const data = await db.$queryRawUnsafe<Array<any & { total_count: bigint }>>(
    `
    SELECT
      inventories."id",
      inventories."name",
      inventories."brandId",
      inventories."warehouseId",
      inventories."minimum",
      inventories."description",
      inventories."unitOfMeasurement",
      inventories."photoUrl",
      inventories."availableStock",
      inventories."totalStock",
      inventories."category",
      inventories."createdAt",
      inventories."updatedAt",
      inventories."deletedAt",
      inventory_brands.name AS "brandName",
      inventory_brands."photoUrl" AS "brandPhotoUrl",
      inventory_brands."deletedAt" AS "brandDeletedAt",
      warehouses.name AS "warehouseName",
      warehouses."deletedAt" AS "warehouseDeletedAt",
      CASE
        WHEN inventories."totalStock" = 0 THEN 'OutOfStock'
        WHEN inventories."totalStock" <= inventories."minimum" AND inventories."totalStock" > 0 THEN 'LowStock'
        ELSE 'Available'
      END AS status,
      COUNT(*) OVER() AS total_count
    FROM inventories
    LEFT JOIN inventory_brands ON inventories."brandId" = inventory_brands.id
    LEFT JOIN warehouses ON inventories."warehouseId" = warehouses.id
    ${whereClause}
    ORDER BY inventories."${orderField}" ${orderDirection}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
    ...params,
  )

  const total = Number(data[0]?.total_count ?? 0)
  const total_pages = Math.ceil(total / limit)
  const hasNextPage = page * limit < total

  const parsedData = data.map(({ total_count, ...i }) => ({
    ...i,
  }))

  if (page === undefined || limit === undefined) {
    return { data: parsedData }
  }

  if (infinite) {
    return {
      data: parsedData,
      nextPage: hasNextPage ? page + 1 : undefined,
    }
  }

  return {
    data: parsedData,
    page,
    limit,
    total,
    total_pages,
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
