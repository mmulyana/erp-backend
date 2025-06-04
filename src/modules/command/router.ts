import { Router } from 'express'
import { getSearch } from './controller'

const router = Router()

router.get('/', getSearch)

export default router
