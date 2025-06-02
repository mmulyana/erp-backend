import { Router } from 'express'
import {
  deleteUser,
  getUser,
  getUsers,
  getUsersInfinite,
  patchResetPassword,
  patchUser,
  postUser,
} from './controller'
import upload from '@/utils/upload'

const router = Router()

router.get('/data/infinite', getUsersInfinite)
router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', upload.single('photoUrl'), postUser)
router.patch('/:id', upload.single('photoUrl'), patchUser)
router.delete('/:id', deleteUser)
router.patch('/:id/reset', patchResetPassword)

export default router
