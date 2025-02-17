export const successResponse = (data?: any, title?: string) => ({
  message: title ? `Berhasil mendapatkan ${title}` : 'Berhasil mendapatkan data',
  data,
})

export const updateResponse = (data?: any, title?: string) => ({
  message: title ? `${title} Berhasil diperbarui` : 'Berhasil diperbarui',
  data,
})

export const deleteResponse = (title?: string) => ({
  message: title ? `${title} Berhasil dihapus` : 'Berhasil dihapus',
})

export const activateResponse = (title?: string) => ({
  message: title ? `${title} Berhasil diaktifkan` : 'Berhasil diaktifkan',
})

export const unactivateResponse = (title?: string) => ({
  message: title ? `${title} Berhasil dinonaktifkan` : 'Berhasil dinonaktifkan',
})
