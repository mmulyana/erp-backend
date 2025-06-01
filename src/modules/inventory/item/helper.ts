import db from '@/lib/prisma'
import { deleteFile } from '@/utils/file'

export const generateStatus = (total: number, minimum: number) => {
  if (total === 0) return 'OutOfStock'
  if (total <= minimum && total > 0) return 'LowStock'
  return 'Available'
}

export const checkPhotoUrl = async (id: string, newPhoto: string | null) => {
  const data = await db.inventory.findUnique({ where: { id } })

  if (data.photoUrl !== newPhoto) {
    await deleteFile(data.photoUrl)
  }
}
