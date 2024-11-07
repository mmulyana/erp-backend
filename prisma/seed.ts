import { PrismaClient } from '@prisma/client'
import { generateUUID } from '../src/utils/generate-uuid'
import { hash } from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

const BOARD_NAMES = ['penawaran', 'dikerjakan', 'penagihan', 'selesai']
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

async function cleanDatabase() {
  await prisma.rolePermission.deleteMany({})
  await prisma.userPermission.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.role.deleteMany({})
  await prisma.permission.deleteMany({})
  await prisma.projectLabel.deleteMany({})
  await prisma.boardContainer.deleteMany({})
}

async function main() {
  console.log('Cleaning existing data...')
  await cleanDatabase()
  console.log('Database cleaned')

  console.log('Starting to seed data...')

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

  // Create Superadmin role with all permissions
  const superadminRole = await prisma.role.create({
    data: {
      name: 'Superadmin',
      description: 'Super Administrator with full access',
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

  const hashedPassword = await hash('password', 10)

  await prisma.user.create({
    data: {
      name: 'superadmin',
      email: process.env.EMAIL as string,
      phoneNumber: process.env.PHONE as string,
      password: hashedPassword,
      roleId: superadminRole.id,
    },
  })

  console.log('Seeding completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
