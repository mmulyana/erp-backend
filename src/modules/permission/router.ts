import { Router } from 'express'
import { getPermissions, updatePermissions } from './controller'

const router = Router()

router.get('/', getPermissions)
router.put('/', updatePermissions)

export default router
