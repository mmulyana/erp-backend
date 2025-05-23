export const parseJsonField = (field: any) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }
  return field
}

export const processTotalPrice = (
  entries: {
    items: { quantity: number; unitPrice: number; totalPrice?: number }[]
  }[],
) => {
  return entries.map((entry) => ({
    ...entry,
    totalPrice: entry.items.reduce(
      (sum, item) => sum + (item.totalPrice ?? item.unitPrice * item.quantity),
      0,
    ),
  }))
}

export function getQueryParam<T extends 'string' | 'number'>(
  query: any,
  key: string,
  type: T,
): T extends 'string' ? string | undefined : number | undefined {
  const value = query[key]

  if (type === 'string') {
    return (
      typeof value === 'string' && value.trim() !== '' ? value : undefined
    ) as any
  }

  if (type === 'number') {
    const num = Number(value)
    return !isNaN(num) ? (num as any) : undefined
  }

  return undefined as any
}
