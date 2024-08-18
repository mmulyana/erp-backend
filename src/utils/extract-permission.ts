type Permission = {
  permission: {
    name: string
  }
}
const extractPermission = (permissions: Permission[]) => {
  const extract: Record<string, { enabled: boolean }> = {}
  permissions.forEach((p) => {
    extract[p.permission.name]
  })
  return extract
}

export default extractPermission
