import db from '../../../lib/db'

export default class UserRoleRepository {
  create = async (ids: number[], userId: number) => {
    try {
      await db.userRole.createMany({
        data: ids.map((id) => ({
          roleId: id,
          userId: userId,
        })),
      })
    } catch (error) {
      throw error
    }
  }
  update = async (ids: number[], userId: number) => {
    try {
      const result = await db.$transaction(async (prisma) => {
        await prisma.userRole.deleteMany({
          where: {
            userId: userId,
          },
        })

        const updateRole = await prisma.userRole.createMany({
          data: ids.map((id) => ({
            roleId: id,
            userId: userId,
          })),
        })

        return updateRole
      })

      return result
    } catch (error) {
      throw error
    }
  }
  delete = async (userId: number) => {
    try {
      await db.userRole.deleteMany({
        where: {
          userId: userId,
        },
      })
    } catch (error) {
      throw error
    }
  }
}
