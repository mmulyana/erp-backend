import { generateUUID } from '../../../utils/generate-uuid'
import { boardContainer, boardItems } from './schema'
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
  updateItem = async () => {}
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
}
