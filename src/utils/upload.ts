import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { ALLOWED_FILE_TYPES, ALLOWED_IMAGE_TYPES } from './constant'

const generateFilename = (prefix: string, originalName: string): string => {
  const ext = path.extname(originalName)
  const id = uuidv4()
  return `${prefix}-${id}${ext}`
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    const prefix = req.params.prefix
    const newFilename = generateFilename(prefix, file.originalname)
    cb(null, newFilename)
  },
})

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_FILE_TYPES]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Jenis file tidak diizinkan!'), false)
  }
}

const upload = multer({ storage, fileFilter })

export default upload
