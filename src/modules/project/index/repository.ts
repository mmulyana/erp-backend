import db from '@/lib/db'
import { generateUUID } from '@/utils/generate-uuid'
import { Project } from './schema'

export default class ProjectRepository {
  create = async (payload: Project) => {
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
  delete = async (id: number) => {
    try {
      const project = await db.project.findUnique({ where: { id } })
      await db.project.delete({ where: { id } })
      await db.boardItems.delete({ where: { id: project?.boardItemsId } })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Omit<Project, 'containerId'>) => {
    try {
      const existingProject = await db.project.findUnique({
        where: { id: id },
        include: {
          labels: {
            select: { labelId: true },
          },
          employees: {
            select: { employeeId: true },
          },
        },
      })
      if (!existingProject) throw new Error('project not exists')

      const existingLabelIds = existingProject.labels.map(
        (label) => label.labelId
      )

      const labelsToAdd = payload.labels.filter(
        (id) => !existingLabelIds.includes(id)
      )
      const labelsToRemove = existingLabelIds.filter(
        (id) => !payload.labels.includes(id)
      )

      const existingEmployeeIds = existingProject.employees.map(
        (employee) => employee.employeeId
      )
      const employeesToAdd = payload.employees.filter(
        (id) => !existingEmployeeIds.includes(id)
      )
      const employeesToRemove = existingEmployeeIds.filter(
        (id) => !payload.employees.includes(id)
      )

      await db.project.update({
        where: { id: id },
        data: {
          // handle label
          labels: {
            deleteMany: {
              labelId: {
                in: labelsToRemove,
              },
            },
            create: labelsToAdd.map((labelId) => ({
              labelId: labelId,
            })),
          },

          // handle employee
          employees: {
            deleteMany: {
              employeeId: {
                in: employeesToRemove,
              },
            },
            create: employeesToAdd.map((employeeId) => ({
              employeeId: employeeId,
            })),
          },

          name: payload.name,
          budget: payload.budget,
          startDate: payload.startDate,
          priority: payload.priority,
          clientId: payload.clientId,
        },
      })
    } catch (error) {
      throw error
    }
  }
  read = async (
    id?: number,
    search?: string,
    labelId?: number,
    clientId?: number
  ) => {
    try {
      if (!!id) {
        return db.project.findUnique({ where: { id } })
      }

      const baseQuery = {
        where: {},
        include: {
          labels: true,
          employees: true,
          comments: true,
        },
      }
      if (search) {
        baseQuery.where = {
          ...baseQuery.where,
          OR: [
            { name: { contains: search.toLowerCase() } },
            { name: { contains: search.toUpperCase() } },
            { name: { contains: search } },
          ],
        }
      }

      if (labelId) {
        baseQuery.where = {
          ...baseQuery.where,
          labels: {
            some: {
              labelId,
            },
          },
        }
      }
      if (clientId) {
        baseQuery.where = {
          ...baseQuery.where,
          clientId: {
            some: {
              clientId,
            },
          },
        }
      }

      return db.project.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }
}
