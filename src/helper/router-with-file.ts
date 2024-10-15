import { NextFunction, Request, Response, Router } from 'express'
import multer from 'multer'
import path from 'path'
import sharp from 'sharp'

export default class RouterWithFile {
  public router: Router
  protected COMPRESSION_QUALITY = 80
  protected upload: multer.Multer
  protected name = 'img'

  constructor(upload: multer.Multer, name: string) {
    this.router = Router()
    this.upload = upload
    this.name = name
  }

  protected compressImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.file) {
      return next()
    }
    const originalName = req.file.originalname
    const fileExtension = path.extname(originalName)
    const baseFilename = path.basename(originalName, fileExtension)

    const newFilename = `${this.name}-${baseFilename}-${Date.now()}.jpeg`
    req.file.filename = newFilename

    sharp(req.file.buffer)
      .toFormat('jpeg')
      .jpeg({ quality: this.COMPRESSION_QUALITY })
      .toFile(`public/img/${req.file.filename}`)

    next()
  }

  protected register(): void {}
}
