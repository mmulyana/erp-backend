export const makePermissionsUnique = (permissions: string): string => {
  return [...new Set(permissions.split(','))].join(',')
}
