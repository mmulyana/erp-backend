import { Router } from 'express'
import {
  saveClient,
  readClient,
  readClients,
  updateClient,
  destroyClient,
  readTopClient,
  readClientsInfinite,
} from './controller'

const router = Router()

router.get('/data/infinite', readClientsInfinite)
router.get('/', readClients)
router.get('/:id', readClient)
router.post('/', saveClient)
router.patch('/:id', updateClient)
router.delete('/:id', destroyClient)

router.get('/data/top-client', readTopClient)

export default router
