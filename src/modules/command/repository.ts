import db from '@/lib/prisma'

type Item = {
  id: string
  label: string
  extra?: string
}

type Group = Record<string, Item[]>

export const search = async (qRaw: string, types: string[]): Promise<Group> => {
  const keyword = typeof qRaw === 'string' ? qRaw.trim() : ''
  const hasKeyword = keyword.length > 0
  const fetchAll = types.length === 0 || hasKeyword

  const result: Group = {}
  const take = 5
  const orderBy = { createdAt: 'desc' as const }

  const searchText = (fields: string[]) =>
    hasKeyword
      ? {
          OR: fields.map((field) => ({
            [field]: { contains: keyword, mode: 'insensitive' },
          })),
        }
      : {}

  const shouldFetch = (type: string) => fetchAll || types.includes(type)

  if (shouldFetch('employee')) {
    const employees = await db.employee.findMany({
      where: searchText(['fullname', 'position', 'phone']),
      orderBy,
      take,
      select: { id: true, fullname: true, position: true },
    })
    result.employee = employees.map((e) => ({
      id: e.id,
      label: e.fullname,
      extra: e.position ?? '',
    }))
  }

  if (shouldFetch('payrollPeriod')) {
    const periods = await db.payrollPeriod.findMany({
      where: hasKeyword
        ? { name: { contains: keyword, mode: 'insensitive' } }
        : {},
      orderBy,
      take,
      select: { id: true, name: true },
    })
    result.payrollPeriod = periods.map((p) => ({
      id: p.id,
      label: p.name,
    }))
  }

  if (shouldFetch('project')) {
    const projects = await db.project.findMany({
      where: searchText(['name', 'description']),
      orderBy,
      take,
      select: { id: true, name: true },
    })
    result.project = projects.map((p) => ({
      id: p.id,
      label: p.name,
    }))
  }

  if (shouldFetch('client')) {
    const clients = await db.client.findMany({
      where: searchText(['name', 'email', 'phone']),
      orderBy,
      take,
      select: { id: true, name: true },
    })
    result.client = clients.map((c) => ({
      id: c.id,
      label: c.name,
    }))
  }

  if (shouldFetch('companyClient')) {
    const companies = await db.companyClient.findMany({
      where: searchText(['name', 'email', 'phone']),
      orderBy,
      take,
      select: { id: true, name: true },
    })
    result.companyClient = companies.map((c) => ({
      id: c.id,
      label: c.name,
    }))
  }

  if (shouldFetch('inventory')) {
    const inventories = await db.inventory.findMany({
      where: searchText(['name', 'description']),
      orderBy,
      take,
      select: { id: true, name: true },
    })
    result.inventory = inventories.map((i) => ({
      id: i.id,
      label: i.name,
    }))
  }

  if (shouldFetch('supplier')) {
    const suppliers = await db.supplier.findMany({
      where: searchText(['name', 'email', 'phone']),
      orderBy,
      take,
      select: { id: true, name: true },
    })
    result.supplier = suppliers.map((s) => ({
      id: s.id,
      label: s.name,
    }))
  }

  if (shouldFetch('warehouse')) {
    const warehouses = await db.warehouse.findMany({
      where: searchText(['name']),
      orderBy,
      take,
      select: { id: true, name: true },
    })
    result.warehouse = warehouses.map((w) => ({
      id: w.id,
      label: w.name,
    }))
  }

  if (shouldFetch('projectAttachment')) {
    const attachments = await db.projectAttachment.findMany({
      where: searchText(['name', 'type']),
      orderBy,
      take,
      select: { id: true, name: true, type: true, fileUrl: true },
    })
    result.projectAttachment = attachments.map((a) => ({
      id: a.fileUrl,
      label: a.name,
      extra: a.type,
    }))
  }

  return result
}
