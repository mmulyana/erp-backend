import db from '@/lib/db'

export const findByEmail = async (email: string) => {
  return db.user.findUnique({ where: { email } })
}
export const findByUsername = async (name: string) => {
  return db.user.findUnique({ where: { name } })
}
export const findByPhone = async (phoneNumber: string) => {
  return db.user.findUnique({ where: { phoneNumber } })
}
