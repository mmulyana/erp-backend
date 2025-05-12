import { Router } from 'express'
import {
  deleteAssignEmployee,
  deleteAttachment,
  deleteProject,
  getAssignedEmployee,
  getAttachments,
  getProject,
  getProjects,
  getProjectsInfinite,
  patchAssignEmployee,
  patchAttachment,
  patchProject,
  postAssignEmployee,
  postAttachment,
  postProject,
} from './controller'
import upload from '@/utils/upload'

const router = Router()

router.get('/data/infinite', getProjectsInfinite)

router.get('/', getProjects)
router.get('/:id', getProject)
router.post('/', postProject)
router.patch('/:id', patchProject)
router.delete('/:id', deleteProject)

router.get('/:id/employee', getAssignedEmployee)
router.get('/:id/attachment', getAttachments)

// employee
router.post('/assign/employee', postAssignEmployee)
router.patch('/assign/employee/:id', patchAssignEmployee)
router.delete('/assign/employee/:id', deleteAssignEmployee)

// attachment
router.post('/data/attachment/:prefix', upload.single('file'), postAttachment)
router.patch('/data/attachment/:id', upload.single('file'), patchAttachment)
router.delete('/data/attachment/:id', deleteAttachment)

export default router
