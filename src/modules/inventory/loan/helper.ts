import db from '@/lib/prisma'
import { deleteFile } from '@/utils/file'

export const checkStatus = async (id: string, quantity: number) => {
  const data = await db.loan.findUnique({ where: { id } })
  const newQuantity = data.returnedQuantity + quantity

  if (data.requestQuantity === newQuantity) {
    await db.loan.update({
      where: { id },
      data: {
        status: 'RETURNED',
      },
    })
  }

  await db.loan.update({
    where: { id },
    data: {
      status: 'PARTIAL_RETURNED',
    },
  })
}

export const checkPhotoUrlIn = async (id: string, newPhoto: string | null) => {
  const data = await db.loan.findUnique({ where: { id } })

  if (newPhoto === null && data.photoUrlIn === null) {
    return
  }

  if (data.photoUrlIn !== newPhoto) {
    await deleteFile(data.photoUrlIn)
  }
}
export const checkPhotoUrlOut = async (id: string, newPhoto: string | null) => {
  const data = await db.loan.findUnique({ where: { id } })

  if (newPhoto === null && data.photoUrlOut === null) {
    return
  }

  if (data.photoUrlOut !== newPhoto) {
    await deleteFile(data.photoUrlOut)
  }
}
