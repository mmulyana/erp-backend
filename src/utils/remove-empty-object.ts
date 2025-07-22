export function removeEmptyProperties<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  const result: Partial<T> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== '') {
      result[key] = obj[key]
    }
  }

  return result
}
