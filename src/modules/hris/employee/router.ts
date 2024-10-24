import {
  addressSchema,
  competencySchema,
  contactSchema,
  employeeSchema,
  positionSchema,
  certifchema,
  updateEmployeeSchema,
  competencySingleSchema,
} from './schema'
import RouterWithFile from '../../../helper/router-with-file'
import { MulterConfig } from '../../../utils/multer-config'
import Validation from '../../../helper/validation'
import EmployeeController from './controller'
import { Multer } from 'multer'

export default class EmployeeRouter extends RouterWithFile {
  private controller: EmployeeController = new EmployeeController()
  private comptencySchema: Validation = new Validation(competencySchema)
  private comptencySingleSchema: Validation = new Validation(competencySingleSchema)
  private employeeSchema: Validation = new Validation(employeeSchema)
  private updateEmployeeSchema: Validation = new Validation(updateEmployeeSchema)
  private positionSchema: Validation = new Validation(positionSchema)
  private addressSchema: Validation = new Validation(addressSchema)
  private contactSchema: Validation = new Validation(contactSchema)
  private certifSchema: Validation = new Validation(certifchema)
  private uploadDoc: Multer

  constructor(multerConfig: MulterConfig) {
    super(multerConfig.uploadImg, 'employee')
    this.uploadDoc = multerConfig.uploadDoc
    this.register()
    this.name = 'employee'
  }

  protected register() {
    this.router.patch('/:id', this.updateEmployeeSchema.validate, this.controller.updateHandler)
    this.router.post('/', this.employeeSchema.validate, this.controller.createHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readAllHandler)
    this.router.get('/:id', this.controller.readHandler)
    this.router.patch('/update-photo/:id', 
      this.upload.single('photo'),
      this.compressImage,
      this.controller.uploadPhotoHandler)
    this.router.patch('/delete-photo/:id', this.controller.deletePhotoHandler)

    this.router.patch('/update-competencies', this.controller.updateCompetenciesHandler)

    this.router.post('/address/:employeeId', this.addressSchema.validate, this.controller.createAddressHandler)
    this.router.patch('/address/:addressId', this.addressSchema.validate, this.controller.updateAddressHandler)
    this.router.delete('/address/:addressId', this.controller.deleteAddressHandler)
    this.router.get('/address/:employeeId', this.controller.readAddressHandler)

    this.router.post('/contact/:employeeId', this.contactSchema.validate, this.controller.createContactHandler)
    this.router.patch('/contact/:contactId', this.contactSchema.validate, this.controller.updateContactHandler)
    this.router.delete('/contact/:contactId', this.controller.deleteContactHandler)
    this.router.get('/contact/:employeeId', this.controller.readContactHandler)

    this.router.patch('/position/:id', this.positionSchema.validate, this.controller.positionHandler)

    this.router.patch('/status/active/:employeeId', this.controller.activeHandler)
    this.router.patch('/status/unactive/:employeeId', this.controller.inactiveHandler)
    this.router.get('/status/track/:employeeId', this.controller.employeeTrackHandler)

    this.router.post('/competency/:employeeId', this.comptencySchema.validate, this.controller.createCompetencyHandler)
    this.router.post('/competency/single/:employeeId', this.comptencySingleSchema.validate, this.controller.createSingleCompetencyHandler)
    this.router.delete('/competency/:competencyId', this.controller.deleteCompetencyHandler)
    this.router.get('/competency/:employeeId', this.controller.readCompetencyHandler)

    this.router.post('/certification/single/:employeeId', this.uploadDoc.single('certif_file'), this.controller.createSingleHandler)
    this.router.post('/certification/:employeeId', this.uploadDoc.array('certif_file', 5), this.controller.createCertifHandler)
    this.router.patch('/certification/:certifId', this.uploadDoc.single('certif_file'), this.controller.updateCertifHandler)
    this.router.delete('/certification/:certifId', this.controller.deleteCertifHandler)
    this.router.get('/certification/:employeeId', this.controller.readCertifHandler)
  }
}
