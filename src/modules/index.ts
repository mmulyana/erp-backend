import { readdirSync } from 'fs'
import { join } from 'path'

const Routes = () => {
  const modulesDir = join(__dirname)
  const routes: { path: string; router: any }[] = []

  readdirSync(modulesDir, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .forEach((dir) => {
      const routePath = join(modulesDir, dir.name, 'routes.ts')
      try {
        const module = require(routePath)
        if (module.default) {
          routes.push({ path: dir.name, router: module.default })
        }
      } catch (error) {
        console.warn(`⚠️  No routes found in ${dir.name}`)
      }
    })

  return routes
}

export default Routes