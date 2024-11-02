export const toNumber = (value: string | number | undefined): number  | undefined => {
  if (value === undefined || value === '') return undefined
  const num = Number(value)
  return isNaN(num) ? undefined : num
}
