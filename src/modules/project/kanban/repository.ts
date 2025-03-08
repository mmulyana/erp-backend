import { OrderItems } from './schema'
import db from '@/lib/prisma'

export const readAll = async () => {
  return await db.boardContainer.findMany({
    include: {
      items: {
        orderBy: {
          position: 'asc',
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              boardItemsId: true,
              clientId: true,
              progressPercentage: true,
              client: {
                select: {
                  name: true,
                  company: {
                    select: {
                      photoUrl: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  employees: true,
                  reports: true,
                  attachments: true,
                },
              },
            },
          },
        },
        where: {
          project: {
            archivedAt: null,
            deletedAt: null,
          },
        },
      },
    },
    orderBy: {
      position: 'asc',
    },
  })
}

export const updateOrderItems = async (payload: OrderItems) => {
  await db.$transaction(async (prismaClient) => {
    // Get all items in the source container
    const sourceItems = await prismaClient.boardItems.findMany({
      where: { containerId: payload.source.droppableId },
      orderBy: { position: 'asc' },
    })

    // Get all items in the destination container
    const destItems =
      payload.source.droppableId === payload.destination.droppableId
        ? sourceItems
        : await prismaClient.boardItems.findMany({
            where: { containerId: payload.destination.droppableId },
            orderBy: { position: 'asc' },
          })

    // Remove the item from the source
    const [movedItem] = sourceItems.splice(payload.source.index, 1)

    // Insert the item into the destination
    destItems.splice(payload.destination.index, 0, movedItem)

    // Update positions for source items
    const sourceUpdates = sourceItems.map((item, index) =>
      prismaClient.boardItems.update({
        where: { id: item.id },
        data: { position: index },
      }),
    )

    // Update positions for destination items
    const destUpdates = destItems.map((item, index) =>
      prismaClient.boardItems.update({
        where: { id: item.id },
        data: {
          position: index,
          containerId: payload.destination.droppableId,
        },
      }),
    )

    await Promise.all([...sourceUpdates, ...destUpdates])
  })
}
