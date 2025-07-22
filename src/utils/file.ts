import fs from 'fs/promises'

export async function deleteFile(filename: string) {
  let filePath = 'uploads/' + filename
  try {
    await fs.unlink(filePath)
    console.log(`Successfully deleted file: ${filePath}`)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log(`File not found, skipping delete: ${filePath}`)
    } else if (error.code === 'EPERM') {
      console.error(`Permission error deleting file: ${filePath}`)
      console.error('Attempting to make file deletable...')
      try {
        await fs.chmod(filePath, 0o666)
        await fs.unlink(filePath)
        console.log(
          `Successfully deleted file after changing permissions: ${filePath}`,
        )
      } catch (chmodError) {
        console.error(`Failed to change file permissions: ${chmodError}`)
      }
    } else {
      console.error(`Error deleting file: ${filePath}`)
      console.error(error)
    }
  }
}
