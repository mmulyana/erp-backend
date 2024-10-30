import db from '../../../lib/db'

interface EstimateItem {
  id: number | null
  name: string
  price: number
  qty: number
}

interface Payload {
  items: EstimateItem[]
}
export default class EstimateRepository {
  saveEstimate = async (projectId: number, payload: Payload) => {
    const itemsToCreate = payload.items.filter((item) => item.id === null)
    const itemsToUpdate = payload.items.filter((item) => item.id !== null)

    await db.$transaction(async (tx) => {
      const createdItems = await Promise.all(
        itemsToCreate.map((item) =>
          tx.projectEstimate.create({
            data: {
              name: item.name,
              price: item.price,
              qty: item.qty,
              projectId: projectId,
            },
          })
        )
      )

      const updatedItems = await Promise.all(
        itemsToUpdate.map((item) =>
          tx.projectEstimate.update({
            where: {
              id: item.id as number,
            },
            data: {
              name: item.name,
              price: item.price,
              qty: item.qty,
              projectId: projectId,
            },
          })
        )
      )

      return [...createdItems, ...updatedItems]
    })

    return { projectId }
  }
  deleteMany = async ({ ids }: { ids: number[] }) => {
    return await db.projectEstimate.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }
  read = async (id: number) => {
    return await db.projectEstimate.findMany({
      where: {
        projectId: id,
      },
    })
  }
}
