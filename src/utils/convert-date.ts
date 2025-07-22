import { parse, formatISO } from 'date-fns'

export const convertDateString = (dateString: string) => {
  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date())
  return formatISO(parsedDate)
}

export const convertUTCToWIB = (utcDate: Date | string): Date => {
  const date = new Date(utcDate)
  return new Date(date.getTime() + 7 * 60 * 60 * 1000)
}

export const convertUTCToWIBString = (utcDate: Date | string): string => {
  return convertUTCToWIB(utcDate).toISOString().slice(0, 10)
}
