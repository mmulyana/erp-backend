import { generateUUID } from '../../../utils/generate-uuid'
import { Project } from './schema'
import db from '../../../lib/db'

export default class ProjectRepository {
  create = async (payload: Project) => {
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
        boardItemsId: id,
        name: payload.name,
        date_created: new Date(),
        date_started: payload.date_started,
        date_ended: payload.date_ended,
        net_value: payload.net_value,
        leadId: payload.leadId,
        description: payload.description,
        clientId: payload.clientId,
        payment_status: payload.payment_status || 0,
        progress: payload.progress || 0,

        // handle label
        labels: {
          create:
            payload.labels &&
            payload.labels.map((id) => ({
              labelId: id,
            })),
        },

        // handle employee
        employees: {
          create:
            payload.employees &&
            payload.employees.map((item) => ({
              employeeId: item,
            })),
        },
      },
    })

    return newProject
  }
  delete = async (id: number) => {
    const project = await db.project.findUnique({ where: { id } })
    await db.project.delete({ where: { id } })
    await db.boardItems.delete({ where: { id: project?.boardItemsId } })
  }
  update = async (
    id: number,
    payload: Omit<Project, 'containerId'> & {
      labels: number[]
      employees: number[]
    }
  ) => {
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
    if (!existingProject) throw new Error('proyek tidak ditemukan')

    // const existingLabelIds = existingProject.labels.map(
    //   (label) => label.labelId
    // )

    // const labelsToAdd = payload?.labels.filter(
    //   (id) => !existingLabelIds.includes(id)
    // )
    // const labelsToRemove = existingLabelIds.filter(
    //   (id) => !payload.labels.includes(id)
    // )

    // const existingEmployeeIds = existingProject.employees.map(
    //   (employee) => employee.employeeId
    // )
    // const employeesToAdd = payload.employees.filter(
    //   (id) => !existingEmployeeIds.includes(id)
    // )
    // const employeesToRemove = existingEmployeeIds.filter(
    //   (id) => !payload.employees.includes(id)
    // )

    return await db.project.update({
      where: { id: id },
      data: {
        name: payload.name,
        date_started: payload.date_started,
        date_ended: payload.date_ended,
        net_value: payload.net_value,
        leadId: payload.leadId,
        description: payload.description,
        clientId: payload.clientId,
        ...(payload.progress ? { progress: payload.progress } : undefined),
        ...(payload.payment_status
          ? { payment_status: payload.payment_status }
          : undefined),

        // handle label
        // labels: {
        //   deleteMany: {
        //     labelId: {
        //       in: labelsToRemove,
        //     },
        //   },
        //   create: labelsToAdd.map((labelId) => ({
        //     labelId: labelId,
        //   })),
        // },

        // handle employee
        // employees: {
        //   deleteMany: {
        //     employeeId: {
        //       in: employeesToRemove,
        //     },
        //   },
        //   create: employeesToAdd.map((employeeId) => ({
        //     employeeId: employeeId,
        //   })),
        // },
      },
      select: {
        id: true,
      },
    })
  }
  read = async (
    id?: number,
    search?: string,
    labelId?: number,
    clientId?: number
  ) => {
    if (!!id) {
      return db.project.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              attachments: true,
              employees: true,
            },
          },
          activities: {
            include: {
              attachments: true,
              user: true,
            },
          },
          attachments: true,
          ProjectEstimate: true,
          boardItems: {
            select: {
              container: {
                select: {
                  color: true,
                  name: true,
                },
              },
            },
          },
          client: {
            select: {
              name: true,
              id: true,
            },
          },
          employees: {
            select: {
              employee: {
                select: {
                  fullname: true,
                  id: true,
                  photo: true,
                },
              },
            },
          },
          labels: {
            select: {
              label: {
                select: {
                  color: true,
                  id: true,
                  name: true,
                },
              },
            },
          },
          lead: {
            select: {
              id: true,
              fullname: true,
              photo: true,
            },
          },
        },
      })
    }

    const baseQuery = {
      where: {},
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

    return db.project.findMany({
      ...baseQuery,
      select: {
        id: true,
        name: true,
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
          },
        },
      },
    })
  }
}
