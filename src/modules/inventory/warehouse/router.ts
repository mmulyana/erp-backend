import { Router } from 'express'
import {
  deleteLocation,
  getLocation,
  getLocations,
  getLocationsInfinite,
  getTotal,
  patchLocation,
  postLocation,
} from './controller'

const router = Router()

router.get('/data/infinite', getLocationsInfinite)
router.get('/data/total', getTotal)

router.get('/', getLocations)
router.get('/:id', getLocation)
router.patch('/:id', patchLocation)
router.post('/', postLocation)
router.delete('/:id', deleteLocation)

export default router
