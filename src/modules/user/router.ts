import { Router } from 'express'
import {
  removePhotoUser,
  removeRoleUser,
  unactivateUser,
  activateUser,
  addPhotoUser,
  addRoleUser,
  createUser,
  deleteUser,
  updateUser,
  findUsers,
  findUser,
} from './controller'
import upload from '@/utils/upload'

const router = Router()

router.get('/', findUsers)
router.get('/:id', findUser)
router.post('/', createUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)
router.patch('/:id/activate', activateUser)
router.patch('/:id/unactivate', unactivateUser)
router.patch('/:id/role/add', addRoleUser)
router.patch('/:id/role/remove', removeRoleUser)
router.patch('/:id/photo/add/:prefix', upload.single('photo'), addPhotoUser)
router.patch('/:id/photo/remove', removePhotoUser)

export default router
