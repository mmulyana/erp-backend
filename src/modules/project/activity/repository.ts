import { Prisma } from '@prisma/client'
import db from '../../../lib/db'
import { deleteFile } from '../../../utils/file'
import { ToggleLike } from './schema'

export default class ActivityRepository {
  create = async (data: Prisma.ActivityCreateManyInput) => {
    return await db.activity.create({
      data,
      select: { projectId: true, replyId: true, id: true },
    })
  }
  update = async (id: number, data: Prisma.ActivityUpdateInput) => {
    return await db.activity.update({
      data,
      where: { id },
      select: {
        id: true,
        projectId: true,
        replyId: true,
      },
    })
  }
  delete = async (id: number) => {
    return await db.activity.delete({
      where: { id },
      select: {
        projectId: true,
        replyId: true,
      },
    })
  }
  read = async (projectId: number, id?: number) => {
    const baseInclude = {
      attachments: true,
      user: true,
      likes: true,
      replies: true,
    }

    if (id) {
      return await db.activity.findUnique({
        where: { id },
        include: {
          ...baseInclude,
          replies: {
            include: {
              user: true,
              likes: true,
              attachments: true,
            },
            orderBy: [{ updated_at: 'desc' }, { created_at: 'desc' }],
          },
        },
      })
    }

    return await db.activity.findMany({
      where: {
        projectId,
        replyId: null,
      },
      include: baseInclude,
      orderBy: [{ updated_at: 'desc' }, { created_at: 'desc' }],
    })
  }
  findByProject = async (projectId: number) => {
    const include = {
      attachments: true,
      user: true,
      likes: true,
      replies: true,
    }

    return await db.activity.findMany({
      where: {
        projectId,
        replyId: null,
      },
      include,
      orderBy: [{ updated_at: 'desc' }, { created_at: 'desc' }],
    })
  }
  findByParent = async (id: number) => {
    const include = {
      attachments: true,
      user: true,
      likes: true,
      replies: true,
    }

    return await db.activity.findUnique({
      where: { id },
      include: {
        ...include,
        replies: {
          include: {
            user: true,
            likes: true,
            attachments: true,
          },
          orderBy: [{ updated_at: 'desc' }, { created_at: 'desc' }],
        },
      },
    })
  }
  toggleLike = async (payload: ToggleLike) => {
    const existing = await db.activityLike.findUnique({
      where: {
        activityId_userId: {
          activityId: payload.activityId,
          userId: payload.userId,
        },
      },
    })

    if (existing) {
      return await db.activityLike.delete({
        where: {
          activityId_userId: {
            activityId: payload.activityId,
            userId: payload.userId,
          },
        },
        select: {
          activityId: true,
          activity: {
            select: {
              projectId: true,
            },
          },
        },
      })
    } else {
      return await db.activityLike.create({
        data: {
          activityId: payload.activityId,
          userId: payload.userId,
        },
        select: {
          activityId: true,
          activity: {
            select: {
              projectId: true,
            },
          },
        },
      })
    }
  }
  uploadAttachments = async (
    files: Express.Multer.File[],
    activityId: number
  ) => {
    await db.activityAttachment.createMany({
      data: files.map((file) => ({
        activityId,
        attachment: file.filename,
      })),
    })

    return db.activity.findUnique({
      where: { id: activityId },
      select: {
        id: true,
        projectId: true,
      },
    })
  }
  removeAttachment = async (payload: { ids: number[] }) => {
    const attachments = await db.activityAttachment.findMany({
      where: {
        id: {
          in: payload.ids,
        },
      },
      select: {
        id: true,
        attachment: true,
        activityId: true,
      },
    })

    if (!attachments.length) {
      throw new Error('No attachments found with the provided IDs')
    }

    await Promise.all(
      attachments
        .filter((item) => item.attachment)
        .map((item) => deleteFile(item.attachment))
    )

    const activity = await db.activity.findUnique({
      where: {
        id: attachments[0].activityId,
      },
      select: {
        id: true,
        projectId: true,
      },
    })

    if (!activity) {
      throw new Error('Associated activity not found')
    }

    await db.activityAttachment.deleteMany({
      where: {
        id: {
          in: payload.ids,
        },
      },
    })

    return activity
  }
  changeAttachment = async (id: number, file: Express.Multer.File) => {
    const data = await db.activityAttachment.findUnique({ where: { id } })

    if (data?.attachment) {
      deleteFile(data.attachment)
    }
    const activity = await db.activity.findUnique({
      where: { id: data?.activityId },
      select: {
        id: true,
        projectId: true,
      },
    })
    await db.activityAttachment.update({
      where: { id },
      data: {
        attachment: file.filename,
      },
    })
    return activity
  }
}
