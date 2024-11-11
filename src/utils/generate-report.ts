import ExcelJS from 'exceljs'
import { Response } from 'express'
import { AttendanceType } from '@prisma/client'

interface ExcelReportData {
  dates: string[]
  data: {
    employeeId: number
    fullname: string
    basic_salary: number
    overtime_salary: number
    position: string | null
    attendance: Array<{
      id: number
      date: Date
      total_hour: number
      type: AttendanceType
    } | null>
    overtime: Array<{
      id: number
      date: Date
      total_hour: number
      description: string | null
    } | null>
    totalCashAdvace: number
    attendanceTotal: number
    overtimeTotal: number
    attendanceFee: number
    overtimeFee: number
    total: number
  }[]
}

export async function generateReport(
  reportData: ExcelReportData,
  res: Response
) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Rekapan')

  const dateColumns = reportData.dates.flatMap((_, index) => [
    { header: 'H', key: `h${index}`, width: 6 },
    { header: 'J', key: `j${index}`, width: 6 },
  ])

  worksheet.columns = [
    { header: 'Nama', key: 'name', width: 30 },
    ...dateColumns,
    { header: 'H', key: 'totalH', width: 6 },
    { header: 'J', key: 'totalJ', width: 6 },
    { header: 'Harian', key: 'dailyRate', width: 15 },
    { header: 'Jam', key: 'overtimeRate', width: 15 },
    { header: 'sub harian', key: 'attendanceFee', width: 15 },
    { header: 'sub jam', key: 'overtimeFee', width: 15 },
    { header: 'kasbon', key: 'cashAdvance', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ]

  const dateHeaderRow = worksheet.getRow(2)

  reportData.dates.forEach((date, index) => {
    const colIndex = index * 2 + 2
    const parsedDate = new Date(date)
    const day = parsedDate.getDate()
    const dayName = parsedDate.toLocaleDateString('id-ID', { weekday: 'short' })

    const startCell = worksheet.getCell(1, colIndex)
    const endCell = worksheet.getCell(1, colIndex + 1)
    worksheet.mergeCells(startCell.address, endCell.address)

    startCell.value = `${dayName}, ${day}`
    startCell.alignment = { horizontal: 'center' }

    dateHeaderRow.getCell(colIndex).value = 'H'
    dateHeaderRow.getCell(colIndex + 1).value = 'J'
  })

  reportData.data.forEach((employee) => {
    const rowData: Record<string, any> = {
      name: employee.fullname,
    }

    reportData.dates.forEach((_, index) => {
      const attendance = employee.attendance[index]
      const overtime = employee.overtime[index]

      rowData[`h${index}`] = attendance?.total_hour || ''
      rowData[`j${index}`] = overtime?.total_hour || ''
    })

    rowData.totalH = employee.attendanceTotal
    rowData.totalJ = employee.overtimeTotal
    rowData.dailyRate = employee.basic_salary
    rowData.overtimeRate = employee.overtime_salary
    rowData.attendanceFee = employee.attendanceFee
    rowData.overtimeFee = employee.overtimeFee
    rowData.cashAdvance = employee.totalCashAdvace
    rowData.total = employee.total

    const row = worksheet.addRow(rowData)

    reportData.dates.forEach((_, index) => {
      const hCell = row.getCell(`h${index}`)
      const jCell = row.getCell(`j${index}`)
      hCell.alignment = { horizontal: 'center' }
      jCell.alignment = { horizontal: 'center' }
    })
  })

  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(2).font = { bold: true }

  worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' }
  worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' }

  const numericColumns = [
    'dailyRate',
    'overtimeRate',
    'attendanceFee',
    'overtimeFee',
    'cashAdvance',
    'total',
  ]
  numericColumns.forEach((key) => {
    const col = worksheet.getColumn(key)
    col.numFmt = '#,##0'
    col.alignment = { horizontal: 'right' }
  })

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=attendance-report.xlsx'
  )

  await workbook.xlsx.write(res)
}
