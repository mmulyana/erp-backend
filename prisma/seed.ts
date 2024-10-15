import { PrismaClient } from '@prisma/client'
import { generateUUID } from '../src/utils/generate-uuid'

const prisma = new PrismaClient()

const BOARD_NAMES = ['Penawaran', 'Dikerjakan', 'Penagihan', 'selesai']
const BOARD_COLORS = ['#DC7A50', '#506FDC', '#4FAAFF', '#2A9D90']

const LABELS_NAMES = ['Maintain', 'Project']
const LABELS_COLORS = ['#5488E8', '#2A9D90']

async function main() {
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
