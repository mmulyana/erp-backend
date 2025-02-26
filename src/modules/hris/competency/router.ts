import { Router } from 'express'
import {
  destroyCompetency,
  readCompetencies,
  readCompetency,
  saveCompetency,
  updateCompetency,
} from './controller'

const router = Router()

router.post('/', saveCompetency)
router.get('/', readCompetencies)
router.get('/:id', readCompetency)
router.patch('/:id', updateCompetency)
router.delete('/:id', destroyCompetency)

export default router
