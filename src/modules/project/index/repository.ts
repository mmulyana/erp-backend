import { generateUUID } from '../../../utils/generate-uuid'
import { Prisma } from '@prisma/client'
import { Project } from './schema'
import db from '../../../lib/db'

interface ProjectFilter {
  search?: string
  labelId?: number
  clientId?: number
  isArchive?: boolean
}

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
      select: {
        boardItems: {
          select: {
            id: true,
          },
        },
        date_ended: true,
      },
    })
    if (!existingProject) throw new Error('proyek tidak ditemukan')

    // handle if change date_ended status will change
    if (!!payload.date_ended) {
      const id = existingProject.boardItems.id

      const lastContainer = await db.boardContainer.findMany({
        orderBy: { position: 'desc' },
        take: 1,
      })

      const boardItem = await db.boardItems.findMany({
        where: { containerId: lastContainer[0].id },
        take: 1,
        orderBy: {
          position: 'desc',
        },
      })

      await db.boardItems.update({
        data: {
          position: !!boardItem.length ? boardItem[0].position + 1 : 0,
          containerId: lastContainer[0].id,
        },
        where: { id },
      })
    }

    const project = await db.project.update({
      where: { id: id },
      data: {
        name: payload.name,
        date_started: payload.date_started,
        date_ended: payload.date_ended,
        net_value: payload.net_value,
        leadId: payload.leadId,
        description: payload.description,
        clientId: payload.clientId,
        progress: payload.progress,
        payment_status: payload.payment_status,
        isArchive: payload.isArchive,
        isDeleted: payload.isDeleted,
      },
      select: {
        id: true,
      },
    })

    let data = {
      id: project.id,
      update: false,
    }
    if (
      payload.name ||
      payload.net_value ||
      payload.leadId ||
      payload.clientId ||
      payload.progress ||
      payload.isArchive ||
      !payload.isArchive ||
      payload.isDeleted ||
      payload.date_ended
    ) {
      data.update = true
    }

    return data
  }
  updateStatus = async (id: number, containerId: string) => {
    const data = await db.project.findUnique({
      where: { id },
      select: {
        boardItems: {
          select: {
            id: true,
            containerId: true,
          },
        },
        id: true,
      },
    })

    const boardItem = await db.boardItems.findMany({
      where: { containerId },
      take: 1,
      orderBy: {
        position: 'desc',
      },
    })

    await db.boardItems.update({
      data: {
        position: !!boardItem.length ? boardItem[0].position + 1 : 0,
        containerId: containerId,
      },
      where: { id: data?.boardItems.id },
    })

    return { id: data?.id }
  }
  read = async (
    id?: number,
    search?: string,
    labelId?: number,
    clientId?: number,
    isArchive: boolean = false
  ) => {
    if (!!id) {
      return db.project.findUnique({
        where: { id },
        include: {
          attachments: true,
          ProjectEstimate: true,
          boardItems: {
            select: {
              container: {
                select: {
                  color: true,
                  name: true,
                  id: true,
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
              id: true,
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
              id: true,
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
      where: {
        isArchive: false,
        isDeleted: false,
      } as Prisma.ProjectWhereInput,
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

    if (isArchive) {
      baseQuery.where = {
        ...baseQuery.where,
        isArchive: true,
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
        clientId,
      }
    }

    return db.project.findMany({
      ...baseQuery,
      select: {
        id: true,
        name: true,
        isArchive: true,
        isDeleted: true,
        boardItemsId: true,
        clientId: true,
        net_value: true,
        progress: true,
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
        labels: {
          select: {
            label: true,
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
        lead: {
          select: {
            id: true,
            fullname: true,
            photo: true,
          },
        },
        _count: {
          select: {
            employees: true,
            activities: true,
            attachments: true,
          },
        },
      },
    })
  }
  readByPagination = async (
    page: number = 1,
    limit: number = 10,
    filter?: ProjectFilter
  ) => {
    const skip = (page - 1) * limit

    const baseQuery = {
      where: {
        isArchive: false,
        isDeleted: false,
      } as Prisma.ProjectWhereInput,
    }

    if (filter?.search) {
      baseQuery.where = {
        ...baseQuery.where,
        OR: [
          { name: { contains: filter.search.toLowerCase() } },
          { name: { contains: filter.search.toUpperCase() } },
          { name: { contains: filter.search } },
        ],
      }
    }

    if (filter?.labelId) {
      baseQuery.where = {
        ...baseQuery.where,
        labels: {
          some: {
            labelId: filter.labelId,
          },
        },
      }
    }

    if (filter?.isArchive) {
      baseQuery.where = {
        ...baseQuery.where,
        isArchive: true,
      }
    }

    if (filter?.clientId) {
      baseQuery.where = {
        ...baseQuery.where,
        clientId: filter.clientId,
      }
    }

    const data = await db.project.findMany({
      skip,
      take: limit,
      ...baseQuery,
      select: {
        id: true,
        name: true,
        isArchive: true,
        isDeleted: true,
        boardItemsId: true,
        clientId: true,
        net_value: true,
        progress: true,
        boardItems: {
          select: {
            container: {
              select: {
                color: true,
                name: true,
                id: true,
              },
            },
          },
        },
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
        lead: {
          select: {
            id: true,
            fullname: true,
            photo: true,
          },
        },
        _count: {
          select: {
            employees: true,
            activities: true,
            attachments: true,
          },
        },
      },
    })

    const total = await db.project.count({ where: baseQuery.where })
    const total_pages = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      total_pages,
    }
  }
  addLabel = async (projectId: number, labelId: number) => {
    return await db.projectHasLabel.create({
      data: { projectId, labelId },
      select: { projectId: true },
    })
  }
  removeLabel = async (id: number) => {
    return await db.projectHasLabel.delete({
      where: { id },
      select: { projectId: true },
    })
  }
  addEmployee = async (projectId: number, employeeId: number) => {
    return await db.employeeAssigned.create({
      data: { projectId, employeeId },
      select: { projectId: true },
    })
  }
  removeEmployee = async (id: number) => {
    return await db.employeeAssigned.delete({
      where: { id },
      select: { projectId: true },
    })
  }

  getTotalProject = async () => {
    const active = await db.project.count({
      where: {
        isArchive: false,
        isDeleted: false,
        date_ended: null,
      },
    })
    const done = await db.project.count({
      where: {
        isArchive: false,
        isDeleted: false,
        date_ended: {
          not: null,
        },
      },
    })

    return { active, done }
  }

  findEmployeeByProjectId = async (id: number) => {
    return await db.employeeAssigned.findMany({
      where: {
        projectId: id,
        employee: {
          pay_type: 'daily',
        },
      },
      select: {
        employee: {
          select: {
            fullname: true,
            basic_salary: true,
          },
        },
      },
    })
  }
}
