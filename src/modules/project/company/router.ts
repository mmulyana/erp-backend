import { Router } from 'express'
import {
  deleteCompany,
  getCompanies,
  getCompaniesInfinite,
  getCompany,
  patchCompany,
  postCompany,
} from './controller'
import upload from '@/utils/upload'

const router = Router()

router.get('/data/infinite', getCompaniesInfinite)
router.get('/', getCompanies)
router.post('/', upload.single('photoUrl'), postCompany)
router.get('/:id', getCompany)
router.patch('/:id', upload.single('photoUrl'), patchCompany)
router.delete('/:id', deleteCompany)

export default router
