import db from '@/lib/prisma'

export const findByEmail = async (email: string) => {
  return db.user.findUnique({ where: { email, active: true, deletedAt: null } })
}
export const findByUsername = async (username: string) => {
  return db.user.findUnique({ where: { username, active: true, deletedAt: null } })
}
export const findByPhone = async (phone: string) => {
  return db.user.findUnique({ where: { phone, active: true, deletedAt: null } })
}

export const findById = async (id: string) => {
  return db.user.findUnique({
    where: { id, deletedAt: null },
    include: {
      role: {
        select: {
          id: true,
          name: true,
          permissions: true,
        },
      },
    },
  })
}
