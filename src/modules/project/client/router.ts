import { Router } from 'express'
import {
  saveClient,
  readClient,
  readClients,
  updateClient,
  destroyClient,
  readTopClient,
} from './controller'

const router = Router()

router.get('/', readClients)
router.get('/:id', readClient)
router.post('/', saveClient)
router.patch('/:id', updateClient)
router.delete('/:id', destroyClient)

router.get('/data/top-client', readTopClient)

export default router
