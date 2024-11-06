import db from '../../lib/db'

export default class AuthRepository {
  findByEmail = async (email: string) => {
    return db.user.findUnique({ where: { email } })
  }
  findByName = async (name: string) => {
    return db.user.findUnique({ where: { name } })
  }
  findByPhone = async (phoneNumber: string) => {
    return db.user.findUnique({ where: { phoneNumber } })
  }
}
