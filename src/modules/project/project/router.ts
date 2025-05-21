import { Router } from 'express'
import {
  deleteAssignEmployee,
  deleteAttachment,
  deleteProject,
  getAssignedEmployee,
  getAttachments,
  getEstimateRevenue,
  getProject,
  getProjectAttachments,
  getProjectReportChart,
  getProjectReports,
  getProjects,
  getProjectsInfinite,
  getProjectStatusChart,
  getTotalNetValue,
  patchAssignEmployee,
  patchAttachment,
  patchProject,
  postAssignEmployee,
  postAttachment,
  postProject,
  postReport,
} from './controller'
import upload from '@/utils/upload'

const router = Router()

router.get('/data/infinite', getProjectsInfinite)
router.get('/data/attachments', getProjectAttachments)
router.get('/data/report', getProjectReports)
router.get('/data/report-chart', getProjectReportChart)
router.get('/data/status-chart', getProjectStatusChart)
router.get('/data/total-revenue', getTotalNetValue)
router.get('/data/estimate-revenue', getEstimateRevenue)

router.post('/report', upload.array('photoUrl', 10), postReport)

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
