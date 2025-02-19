export const MAX_FILE_SIZE = 5000000

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

export const Messages = {
  BadRequest: 'Invalid input data. Please check your request and try again.',
  InvalidEmail: 'Format email salah',
  InvalidName: 'Nama harus lebih dari 1 huruf',
  supportedImage: 'Only .jpg, .jpeg, .png and .webp formats are supported.',
  InvalidMaxSize: `Max image size is ${MAX_FILE_SIZE / 1000000}MB.`,
  InvalidOldPassword: 'Password lama harus diisi',
  InvalidPassword: 'Password sekurangnya 8 karakter',
  AccountDoesntExists: 'akun tidak ada',
  InvalidCredential: 'Kredensial salah',
  EmaildAlreadyUsed: 'Email ini sudah digunakan',
  PhoneAlreadyUsed: 'Nomor telepon ini sudah digunakan',
  UsernameAlreadyUsed: 'Username ini sudah digunakan',
  paramsIdNotFound: 'params id tidak ada',
  dataNotFound: 'data tidak ditemukan',
  notFound: 'tidak ditemukan',
  fileNotSended: 'Tidak ada file yang dikirim!',
  InvalidUUID: 'invalid uuid',
  TourExist: 'Tur sudah ada',
}

export const TEST_URL = 'http://localhost:5001'
