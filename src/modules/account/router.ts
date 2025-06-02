import { Router } from 'express'
import { patchInfo, patchPassword } from './controller'
import upload from '@/utils/upload'

const router = Router()

router.patch('/:id/info', upload.single('photoUrl'), patchInfo)
router.patch('/:id/password', patchPassword)

export default router
