export const successResponse = (data?: any, title?: string) => ({
  message: title
    ? `Berhasil mendapatkan ${title}`
    : 'Berhasil mendapatkan data',
  data,
})

export const updateResponse = (data?: any, title?: string) => ({
  message: title ? `${title} berhasil diperbarui` : 'Berhasil diperbarui',
  data,
})

export const deleteResponse = (title?: string, data?: any) => ({
  message: title ? `${title} berhasil dihapus` : 'Berhasil dihapus',
  data,
})

export const activateResponse = (title?: string) => ({
  message: title ? `${title} berhasil diaktifkan` : 'Berhasil diaktifkan',
})

export const unactivateResponse = (title?: string) => ({
  message: title ? `${title} berhasil dinonaktifkan` : 'Berhasil dinonaktifkan',
})

export const createResponse = (data?: any, title?: string) => ({
  message: title
    ? `${title} berhasil ditambahkan`
    : 'data berhasil ditambahkan',
  data,
})
