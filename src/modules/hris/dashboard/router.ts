import { Router } from 'express'
import {
  getEmployeeEducation,
  getEmployeePosition,
  getExpiringCertificates,
  getExpiringSafetyInduction,
  getTotal,
} from './controller'

const router = Router()

router.get('/total', getTotal)

router.get('/expire/certificate', getExpiringCertificates)
router.get('/expire/safety-induction', getExpiringSafetyInduction)

router.get('/data/position', getEmployeePosition)
router.get('/data/last-education', getEmployeeEducation)

export default router
