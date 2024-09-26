import fs from 'fs'
import path from 'path'

export const removeImg = (filename: string) => {
  fs.unlink(path.join('public/img', filename), (err) => {
    if (err) {
      console.error(`Error deleting original file: ${err}`)
    }
  })
}
