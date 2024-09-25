import { NextFunction, Request, Response, Router } from 'express'
import multer from 'multer'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'

export default class RouterWithFile {
  public router: Router
  protected COMPRESSION_QUALITY = 80
  protected upload: multer.Multer

  constructor(upload: multer.Multer) {
    this.router = Router()
    this.upload = upload
  }

  protected compressImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.file) {
      return next()
    }

    const { filename: image } = req.file
    const imagePath = path.join('public/img', image)
    const outputPath = path.join('public/img', `compressed_${image}`)

    try {
      await sharp(imagePath)
        .jpeg({ quality: this.COMPRESSION_QUALITY })
        .png({ quality: this.COMPRESSION_QUALITY })
        .webp({ quality: this.COMPRESSION_QUALITY })
        .toFile(outputPath)

      fs.unlink(path.join('public/img', image), (err) => {
        if (err) {
          console.error(`Error deleting original file: ${err}`)
        }
      })

      req.file.path = outputPath
      req.file.filename = `compressed_${image}`

      next()
    } catch (error) {
      console.error(`Error compressing image: ${error}`)
      next()
    }
  }

  protected register(): void {}
}