import { parse, formatISO } from 'date-fns'

export const convertDateString = (dateString: string) => {
  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date())
  return formatISO(parsedDate)
}
