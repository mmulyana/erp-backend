import { Router } from 'express'

import upload from '@/utils/upload'
import {
  deleteCertificate,
  deleteEmployee,
  getAttendancesById,
  getCashAdvancesById,
  getCertificate,
  getCertificates,
  getEmployee,
  getEmployees,
  getEmployeesInfinite,
  getOvertimesById,
  patchCertificate,
  patchEmployee,
  postCertificate,
  postEmployee,
} from './controller'

const router = Router()

// employee
router.get('/data/infinite', getEmployeesInfinite)
// certificate
router.get('/data/certificate/:id', getCertificate)
router.patch('/data/certificate/:id', upload.single('file'), patchCertificate)
router.delete('/data/certificate/:id', deleteCertificate)

router.get('/', getEmployees)
router.post('/:prefix', upload.single('photoUrl'), postEmployee)
router.get('/:id', getEmployee)
router.patch('/:id', patchEmployee)
router.delete('/:id', deleteEmployee)

// detail
router.get('/:id/data/attendance', getAttendancesById)
router.get('/:id/data/overtime', getOvertimesById)
router.get('/:id/data/cash-advance', getCashAdvancesById)

// certificate
router.get('/:id/certificate', getCertificates)
router.post('/:id/certificate/:prefix', upload.single('file'), postCertificate)

export default router
