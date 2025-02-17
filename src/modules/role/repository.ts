import db from '@/lib/prisma'
import { getPaginateParams } from '@/utils/params'
import { Prisma } from '@prisma/client'
import { createRole } from './schema'

export const findAll = async (
  page?: number,
  limit?: number,
  search?: string,
) => {
  const where: Prisma.RoleWhereInput = {
    AND: [search ? { name: { contains: search } } : {}],
  }

  if (page === undefined || limit === undefined) {
    const roles = await db.role.findMany({
      where,
      orderBy: { name: 'asc' },
      // include: {}
    })

    return { roles }
  }

  const { skip, take } = getPaginateParams(page, limit)
  const [roles, total] = await Promise.all([
    db.role.findMany({
      skip,
      take,
      where,
      orderBy: { name: 'asc' },
    }),
    db.role.count({ where }),
  ])

  return {
    roles,
    total,
    page,
    limit,
  }
}

export const create = async (data: createRole) => {
  return await db.role.create({
    data: {
      name: data.name,
      description: data.description,
    },
  })
}


// import { Prisma } from '@prisma/client'
// import db from '../../lib/db'

// export default class RoleRepository {
//   getAll = async () => {
//     return await db.role.findMany({
//       include: {
//         RolePermission: {
//           include: {
//             permission: true,
//           },
//         },
//         _count: {
//           select: {
//             users: true,
//           },
//         },
//       },
//     })
//   }
//   getById = async (id: number) => {
//     return await db.role.findUnique({
//       where: { id },
//       include: {
//         RolePermission: {
//           include: {
//             permission: true,
//           },
//         },
//         _count: {
//           select: {
//             users: true,
//           },
//         },
//       },
//     })
//   }
//   updateById = async (id: number, data: Prisma.RoleUpdateInput) => {
//     return await db.role.update({ where: { id }, data })
//   }
//   create = async (data: Prisma.RoleCreateInput) => {
//     return await db.role.create({ data })
//   }
//   deleteById = async (id: number) => {
//     return await db.role.delete({ where: { id } })
//   }
//   getPermissionById = async (id: number) => {
//     return await db.permission.findUnique({ where: { id } })
//   }
//   createPermissionRole = async (data: {
//     roleId: number
//     permissionId: number
//   }) => {
//     return await db.rolePermission.create({ data })
//   }
//   deletePermissionRole = async (roleId: number, permissionId: number) => {
//     return await db.rolePermission.delete({
//       where: {
//         roleId_permissionId: {
//           roleId,
//           permissionId
//         }
//       },
//     })
//   }
// }
