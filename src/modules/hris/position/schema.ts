import { z } from 'zod'

export const PositionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, { message: 'Nama jabatan tidak boleh kosong' })
    .max(50, { message: 'Nama jabatan maksimal 50 karakter' }),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: 'Format warna harus berupa kode hex (contoh: #FFFFFF)',
    })
    .optional(),
  description: z
    .string()
    .max(255, { message: 'Deskripsi maksimal 255 karakter' })
    .optional(),
})
