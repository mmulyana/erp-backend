import { generateUUID } from '../../../utils/generate-uuid'
import { boardContainer, boardItems, OrderItems } from './schema'
import db from '../../../lib/db'
import { z } from 'zod'

type Container = z.infer<typeof boardContainer>
type Items = z.infer<typeof boardItems>

export default class KanbanRepository {
  createBoard = async (payload: Container) => {
    try {
      const lastContainer = await db.boardContainer.findFirst({
        orderBy: {
          position: 'desc',
        },
      })
      const position = lastContainer ? lastContainer.position + 1 : 0
      const id = `container-${generateUUID()}`
      await db.boardContainer.create({ data: { ...payload, id, position } })
    } catch (error) {
      throw error
    }
  }
  updateBoard = async (id: string, data: Container) => {
    try {
      await db.boardContainer.update({ data, where: { id } })
    } catch (error) {
      throw error
    }
  }
  deleteBoard = async (id: string) => {
    try {
      await db.boardContainer.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  readBoard = async () => {
    try {
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
                  startDate: true,
                  budget: true,
                  priority: true,
                  boardItemsId: true,
                  clientId: true,
                  boardItems: true,
                  labels: {
                    select: {
                      label: true,
                    },
                  },
                  employees: {
                    select: {
                      employee: {
                        select: {
                          fullname: true,
                          photo: true,
                        },
                      },
                    },
                  },
                  comments: {
                    select: {
                      comment: true,
                    },
                  },
                  client: {
                    select: {
                      name: true,
                      company: {
                        select: {
                          logo: true,
                        },
                      },
                    },
                  },
                  _count: {
                    select: {
                      employees: true,
                      comments: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      })
    } catch (error) {
      throw error
    }
  }

  createItem = async (payload: Items) => {
    try {
      const lastItem = await db.boardItems.findFirst({
        where: {
          containerId: payload.containerId,
        },
        orderBy: {
          position: 'desc',
        },
      })
      const position = lastItem ? lastItem.position + 1 : 0
      const id = `item-${generateUUID()}`
      await db.boardItems.create({
        data: { id, position, containerId: payload.containerId },
      })

      const newProject = await db.project.create({
        data: {
          name: payload.name,
          budget: payload.budget,
          startDate: payload.startDate,
          priority: payload.priority,
          boardItemsId: id,
          clientId: payload.clientId,
        },
      })

      if (!!payload.labels?.length) {
        await db.projectHasLabel.createMany({
          data: payload.labels.map((labels) => ({
            projectId: newProject.id,
            labelId: labels,
          })),
        })
      }

      if (!!payload.employees?.length) {
        await db.employeeAssigned.createMany({
          data: payload.employees.map((employee) => ({
            employeeId: employee,
            projectId: newProject.id,
          })),
        })
      }
    } catch (error) {
      throw error
    }
  }
  deleteItem = async (id: string) => {
    try {
      const items = await db.boardItems.findFirst({
        where: { id },
        include: { project: { select: { id: true } } },
      })
      await db.project.delete({ where: { id: items?.project?.id } })
      await db.boardItems.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }

  updateProject = async (
    id: number,
    payload: Omit<Items, 'position' | 'employees' | 'labels'>
  ) => {
    try {
      await db.project.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }

  updateOrderItems = async (payload: OrderItems[]) => {
    try {
      await db.$transaction(async (prismaClient) => {
        const updateOperations = [
          ...payload.map((newItem) =>
            prismaClient.boardItems.update({
              where: { id: newItem.id },
              data: {
                position: newItem.position,
                containerId: newItem.containerId,
              },
            })
          ),
        ]

        await Promise.all(updateOperations)
      })
    } catch (error) {
      throw error
    }
  }
}
