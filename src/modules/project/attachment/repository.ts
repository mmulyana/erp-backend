import { deleteFile, PATHS } from '../../../utils/file'
import { Attachment } from './schema'
import db from '../../../lib/db'

export default class AttachmentRepository {
  createAttachment = async (
    payload: Attachment & { file: Express.Multer.File | null }
  ) => {
    return await db.projectAttachment.create({
      data: {
        name: payload.name,
        type: payload.type,
        uploaded_by: Number(payload.uploaded_by),
        projectId: Number(payload.projectId),
        isSecret: payload.isSecret,
        file: payload.file?.filename as string,
        uploaded_at: new Date(),
      },
      include: {
        user: true,
        project: true,
      },
    })
  }

  readAttachment = async (id: number) => {
    await db.projectAttachment.findUnique({
      where: { id },
      include: {
        project: true,
        user: true,
      },
    })
  }

  updateAttachment = async (
    id: number,
    payload: Partial<Attachment> & { newFile: string | null }
  ) => {
    const existing = await db.projectAttachment.findUnique({ where: { id } })
    if (payload.newFile !== '' && existing?.file) {
      deleteFile(existing.file, PATHS.FILES)
    }

    return await db.projectAttachment.update({
      where: { id },
      data: {
        ...payload,
        uploaded_by: Number(payload.uploaded_by),
        projectId: Number(payload.projectId),
      },
    })
  }

  deleteAttachment = async (id: number) => {
    const existing = await db.projectAttachment.findUnique({ where: { id } })
    if (existing?.file) {
      deleteFile(existing.file, PATHS.FILES)
    }

    return await db.projectAttachment.delete({
      where: { id },
      select: {
        projectId: true,
      },
    })
  }
}
