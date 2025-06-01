export const makePermissionsUnique = (permissions: string): string => {
  if (!permissions) return undefined
  return [...new Set(permissions.split(','))].join(',')
}
