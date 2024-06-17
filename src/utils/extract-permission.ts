type Permission = {
  enabled: boolean
  permission: {
    name: string
  }
}
const extractPermission = (permissions: Permission[]) => {
  const extract: Record<string, { enabled: boolean }> = {}
  permissions.forEach((p) => {
    extract[p.permission.name] = { enabled: p.enabled }
  })
  return extract
}

export default extractPermission