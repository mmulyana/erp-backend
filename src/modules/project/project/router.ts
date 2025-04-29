import { Router } from 'express'
import {
  deleteAssignEmployeee,
  deleteProject,
  getProject,
  getProjects,
  getProjectsInfinite,
  patchAssignEmployeee,
  patchProject,
  patchStatusProject,
  postAssignEmployeee,
  postProject,
} from './controller'

const router = Router()

router.get('/data/infinite', getProjectsInfinite)

router.get('/', getProjects)
router.get('/:id', getProject)
router.post('/', postProject)
router.patch('/:id', patchProject)
router.delete('/:id', deleteProject)

router.patch(':id/status', patchStatusProject)

router.post('assign/employee', postAssignEmployeee)
router.patch('assign/employee/:id', patchAssignEmployeee)
router.delete('assign/employee/:id', deleteAssignEmployeee)

export default router
