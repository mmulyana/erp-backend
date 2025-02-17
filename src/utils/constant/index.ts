export const MAX_FILE_SIZE = 5000000

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
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
}
