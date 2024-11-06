import db from '../../lib/db'

export default class DashboardRepository {
  readTotal = async () => {
    const employee = await db.employee.count({
      where: {
        isHidden: false,
        status: true,
      },
    })
    const project = await db.project.count()

    return { total: { employee, project } }
  }
}
