import { Router } from 'express'
import upload from '@/utils/upload'
import {
  deleteBrand,
  getBrand,
  getBrands,
  getBrandsInfinite,
  patchBrand,
  patchDestroyPhotoBrand,
  postBrand,
} from './controller'

const router = Router()

router.get('/data/infinite', getBrandsInfinite)
router.get('/', getBrands)
router.get('/:id', getBrand)
router.patch('/:id', upload.single('photoUrl'), patchBrand)
router.post('/', upload.single('photoUrl'), postBrand)
router.delete('/:id', deleteBrand)

router.patch('/:id/photo', patchDestroyPhotoBrand)

export default router
