import { PrismaClient } from '@prisma/client'
import { generateUUID } from '../src/utils/generate-uuid'
import { hash } from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

const BOARD_NAMES = ['penawaran', 'dikerjakan', 'penagihan', 'selesai']
const BOARD_COLORS = ['#DC7A50', '#506FDC', '#4FAAFF', '#2A9D90']

async function main() {
  const existingBoards = await prisma.boardContainer.findFirst()
  const existingSuperadmin = await prisma.role.findFirst({
    where: { name: 'Superadmin' },
  })
  const existingUser = await prisma.user.findUnique({
    where: { email: process.env.EMAIL },
  })

  if (!existingBoards) {
    const boardPromises = BOARD_NAMES.map((name, i) =>
      prisma.boardContainer.create({
        data: {
          id: `container-${generateUUID()}`,
          name: name,
          color: BOARD_COLORS[i],
          position: i,
        },
      }),
    )
    await Promise.all(boardPromises)
  }

  if (!existingSuperadmin) {
    // Create Superadmin role
    const superadminRole = await prisma.role.create({
      data: {
        name: 'Superadmin',
        description: 'Akses semua fitur',
      },
    })

    if (!existingUser) {
      // Create superadmin user
      await prisma.user.create({
        data: {
          username: process.env.NAME as string,
          email: process.env.EMAIL as string,
          phone: process.env.PHONE as string,
          password: await hash(process.env.DEFAULT_PASSWORD as string, 10),
          roleId: superadminRole.id,
        },
      })
    }
  }

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
