import { Router } from 'express'
import {
  readProjects,
  readProject,
  saveProject,
  updateProject,
  destroyProject,
  updateStatusProject,
  readTotalProject,
  saveAssignEmployeee,
  updateAssignEmployeee,
  destroyAssignEmployeee,
  readProjectsInfinite,
} from './controller'

const router = Router()

router.get('/data/infinite', readProjectsInfinite)
router.patch('data/total', readTotalProject)

router.get('/', readProjects)
router.get('/:id', readProject)
router.post('/', saveProject)
router.patch('/:id', updateProject)
router.delete('/:id', destroyProject)

router.patch(':id/status', updateStatusProject)

router.post('assign/employee', saveAssignEmployeee)
router.patch('assign/employee/:id', updateAssignEmployeee)
router.delete('assign/employee/:id', destroyAssignEmployeee)


export default router
