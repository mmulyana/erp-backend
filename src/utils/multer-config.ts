import multer from 'multer'
import path from 'path'

export interface MulterConfig {
  uploadImg: multer.Multer
  uploadDoc: multer.Multer
}

export function createMulter(): MulterConfig {
  const uploadImg = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true)
      } else {
        cb(new Error('Bukan gambar! Mohon upload gambar.'))
      }
    },
  })

  const uploadDoc = multer({
    storage: multer.diskStorage({
      destination: 'public/files/',
      filename: (req, file, cb) => {
        cb(
          null,
          req.query.file_name + file.originalname + '-' + Date.now() + path.extname(file.originalname)
        )
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(
          new Error(
            'Tipe file tidak valid. Hanya file PDF, Word, dan Excel yang diizinkan.'
          )
        )
      }
    },
  })

  return { uploadImg, uploadDoc }
}
