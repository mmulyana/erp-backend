import { Router } from 'express'
import {
  getExpiringCertificates,
  getExpiringSafetyInduction,
  getTotal,
} from './controller'

const router = Router()

router.get('/total', getTotal)

router.get('/expire/certificate', getExpiringCertificates)
router.get('/expire/safety-induction', getExpiringSafetyInduction)

export default router
