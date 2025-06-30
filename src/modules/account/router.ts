import { Router } from 'express'
import { patchInfo, patchPassword, patchResetPassword } from './controller'
import upload from '@/utils/upload'

const router = Router()

router.patch('/:id/info', upload.single('photoUrl'), patchInfo)
router.patch('/:id/password', patchPassword)
router.patch('/:id/reset-password', patchResetPassword)

export default router
