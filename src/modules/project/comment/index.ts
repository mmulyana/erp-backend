import { Socket } from 'socket.io'
import prisma from '@/lib/prisma'

export function commentSocketHandler(socket: Socket) {
  socket.on('report-comment:join', (reportId: string) => {
    socket.join(reportId)
    console.log(`Socket ${socket.id} joined room ${reportId}`)
  })

  socket.on('report-comment:findAll', async (reportId: string) => {
    const comments = await prisma.reportComment.findMany({
      where: { reportId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    })

    socket.emit('report-comment:all', comments)
  })

  socket.on('report-comment:create', async (data) => {
    const comment = await prisma.reportComment.create({
      data,
      include: { user: true },
    })

    socket.emit('report-comment:created', comment)
    socket.to(comment.reportId).emit('report-comment:created', comment)
  })

  socket.on('report-comment:update', async ({ id, message }) => {
    const updated = await prisma.reportComment.update({
      where: { id },
      data: { message },
      include: { user: true },
    })

    socket.emit('report-comment:updated', updated)
    socket.to(updated.reportId).emit('report-comment:updated', updated)
  })

  socket.on('report-comment:delete', async (id: string) => {
    const deleted = await prisma.reportComment.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    socket.emit('report-comment:deleted', id)
    socket.to(deleted.reportId).emit('report-comment:deleted', id)
  })
}
