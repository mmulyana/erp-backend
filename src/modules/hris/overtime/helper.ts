import { Prisma } from '@prisma/client'

export const generateData = (
  item: Prisma.OvertimeGetPayload<{ select: Prisma.OvertimeSelect }>,
) => ({
  id: item.id,
  fullname: item.employee.fullname,
  photoUrl: item.employee.photoUrl,
  position: item.employee.position ?? '-',
  totalHour: item.totalHour,
  note: item.note ?? '',
  deletedAt: item.deletedAt,
  project: item.project,
  projectId: item.projectId,
})
