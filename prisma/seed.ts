import { PrismaClient } from '@prisma/client'
import { generateUUID } from '../src/utils/generate-uuid'

const prisma = new PrismaClient()

const BOARD_NAMES = ['Penawaran', 'Dikerjakan', 'Penagihan', 'selesai']
const BOARD_COLORS = ['#DC7A50', '#506FDC', '#4FAAFF', '#2A9D90']

const LABELS_NAMES = ['Maintain', 'Project']
const LABELS_COLORS = ['#5488E8', '#2A9D90']

const PERMISSIONS = [
  'employee:create',
  'employee:update',
  'employee:delete',
  'employee:detail',
  'attendance:create',
  'attendance:update',
  'attendance:delete',
  'attendance:read',
  'overtime:create',
  'overtime:update',
  'overtime:delete',
  'overtime:read',
]

// Define permission sets for different roles
const ROLE_PERMISSIONS = {
  admin: [
    'employee:detail',
    'attendance:read',
    'attendance:update',
    'overtime:read',
    'overtime:update',
  ],
  staff: [
    'attendance:create',
    'attendance:read',
    'overtime:create',
    'overtime:read',
  ],
}

async function main() {
  // Create board containers
  for (let i = 0; i < 4; i++) {
    let id = `container-${generateUUID()}`
    await prisma.boardContainer.create({
      data: {
        id,
        name: BOARD_NAMES[i],
        color: BOARD_COLORS[i],
        position: i,
      },
    })
  }

  for (let i = 0; i < 2; i++) {
    await prisma.projectLabel.create({
      data: {
        name: LABELS_NAMES[i],
        color: LABELS_COLORS[i],
      },
    })
  }

  await prisma.permission.createMany({
    data: PERMISSIONS.map((item) => ({
      name: item,
    })),
    skipDuplicates: true,
  })

  const permissions = await prisma.permission.findMany({
    where: {
      name: {
        in: PERMISSIONS,
      },
    },
  })

  await prisma.role.create({
    data: {
      name: 'Superadmin',
      rolePermissions: {
        create: permissions.map((permission) => ({
          permission: {
            connect: { id: permission.id },
          },
        })),
      },
    },
  })

  await prisma.role.create({
    data: {
      name: 'Admin',
      rolePermissions: {
        create: permissions
          .filter((permission) =>
            ROLE_PERMISSIONS.admin.includes(permission.name)
          )
          .map((permission) => ({
            permission: {
              connect: { id: permission.id },
            },
          })),
      },
    },
  })

  await prisma.role.create({
    data: {
      name: 'Staff',
      rolePermissions: {
        create: permissions
          .filter((permission) =>
            ROLE_PERMISSIONS.staff.includes(permission.name)
          )
          .map((permission) => ({
            permission: {
              connect: { id: permission.id },
            },
          })),
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
