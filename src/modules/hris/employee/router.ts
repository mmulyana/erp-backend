import { Router } from 'express'
import {
  deletePhotoEmployee,
  destoryCertifEmployee,
  destroyEmployee,
  readEmployee,
  readEmployees,
  readExpireCertifEmployee,
  readExpireSafetyEmployee,
  saveCertifEmployee,
  saveEmployee,
  updateCertifEmployee,
  updateEmployee,
  uploadPhotoEmployee,
} from './controller'
import upload from '@/utils/upload'

const router = Router()

router.get('/', readEmployees)
router.post('/', upload.single('photoUrl'), saveEmployee)
router.get('/:id', readEmployee)
router.patch('/:id', updateEmployee)
router.delete('/:id', destroyEmployee)

router.patch('/:id/photo/:prefix', upload.single('photo'), uploadPhotoEmployee)
router.delete('/:id/photo', deletePhotoEmployee)

router.post(
  '/:id/certification/:prefix',
  upload.single('file'),
  saveCertifEmployee,
)
router.patch('/:id/certification', upload.single('file'), updateCertifEmployee)
router.delete('/:id/certification/:certifId', destoryCertifEmployee)

router.get('/expire/certification/:positionId', readExpireCertifEmployee)
router.get('/expire/safety', readExpireSafetyEmployee)

export default router
