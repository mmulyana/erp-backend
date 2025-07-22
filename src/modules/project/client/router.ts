import { Router } from 'express'
import {
  saveClient,
  readClient,
  readClients,
  updateClient,
  destroyClient,
  readClientsInfinite,
  getClientRank,
} from './controller'

const router = Router()

router.get('/data/infinite', readClientsInfinite)
router.get('/data/client-rank', getClientRank)

router.get('/', readClients)
router.get('/:id', readClient)
router.post('/', saveClient)
router.patch('/:id', updateClient)
router.delete('/:id', destroyClient)

export default router
