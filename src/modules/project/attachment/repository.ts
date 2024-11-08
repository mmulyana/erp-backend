import { deleteFile, PATHS } from '../../../utils/file'
import { Attachment } from './schema'
import db from '../../../lib/db'
import { Prisma } from '@prisma/client'

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

  findById = async (id: number) => {
    return await db.projectAttachment.findUnique({
      where: { id },
      include: {
        project: true,
        user: true,
      },
    })
  }

  findAll = async (name?: string) => {
    const where: Prisma.ProjectAttachmentWhereInput = {}

    if (name) {
      where.OR = [{ name: { contains: name.toLowerCase() } }]
      where.OR = [{ name: { contains: name.toUpperCase() } }]
      where.OR = [{ name: { contains: name } }]
    }

    return await db.projectAttachment.findMany({
      where,
      take: name ? undefined : 20,
      orderBy: {
        uploaded_at: 'desc',
      },
    })
  }

  updateAttachment = async (id: number, payload: Partial<Attachment>) => {
    // const existing = await db.projectAttachment.findUnique({ where: { id } })
    // if (payload.newFile !== '' && existing?.file) {
    //   deleteFile(existing.file, PATHS.FILES)
    // }

    return await db.projectAttachment.update({
      where: { id },
      data: {
        isSecret: payload.isSecret,
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
