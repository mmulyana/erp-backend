import { Router } from 'express'
import {
  deleteLocation,
  getLocation,
  getLocations,
  getLocationsInfinite,
  patchLocation,
  postLocation,
} from './controller'

const router = Router()

router.get('/data/infinite', getLocationsInfinite)
router.get('/', getLocations)
router.get('/:id', getLocation)
router.patch('/:id', patchLocation)
router.post('/', postLocation)
router.delete('/:id', deleteLocation)

export default router
