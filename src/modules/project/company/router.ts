import { Router } from 'express'
import {
  destroyCompany,
  readCompanies,
  readCompany,
  saveCompany,
  updateCompany,
} from './controller'

const router = Router()

router.get('/', readCompanies)
router.post('/', saveCompany)
router.get('/:id', readCompany)
router.patch('/:id', updateCompany)
router.delete('/:id', destroyCompany)

export default router
