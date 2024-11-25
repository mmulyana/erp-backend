export const generateDateRange = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = []
  const currentDate = new Date(startDate)
  const lastDate = new Date(endDate)

  currentDate.setHours(17, 0, 0, 0)
  lastDate.setHours(17, 0, 0, 0)

  while (currentDate <= lastDate) {
    dates.push(currentDate.toISOString())
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

export const convertToWIB = (date: Date): Date => {
  const newDate = new Date(date)
  newDate.setHours(17, 0, 0, 0)
  return newDate
}
