import db from '@/lib/prisma'

export const findByEmail = async (email: string) => {
  return db.user.findUnique({ where: { email } })
}
export const findByUsername = async (username: string) => {
  return db.user.findUnique({ where: { username } })
}
export const findByPhone = async (phone: string) => {
  return db.user.findUnique({ where: { phone } })
}

export const findById = async (id: string) => {
  return db.user.findUnique({
    where: { id },
    include: {
      tours: true,
    },
  })
}
