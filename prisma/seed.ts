import { PrismaClient } from '@prisma/client'
import { generateUUID } from '../src/utils/generate-uuid'
import { hash } from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

const BOARD_NAMES = ['penawaran', 'dikerjakan', 'penagihan', 'selesai']
const BOARD_COLORS = ['#DC7A50', '#506FDC', '#4FAAFF', '#2A9D90']

const LABELS_NAMES = ['Maintain', 'Project']
const LABELS_COLORS = ['#5488E8', '#2A9D90']

const GROUP_PERMISSION = [
  {
    name: 'employee',
    permissions: [
      {
        key: 'position:create',
        name: 'Buat Jabatan',
        description: 'Kemampuan untuk membuat jabatan baru',
      },
      {
        key: 'position:update',
        name: 'Ubah Jabatan',
        description: 'Kemampuan untuk mengubah jabatan yang ada',
      },
      {
        key: 'position:delete',
        name: 'Hapus Jabatan',
        description: 'Kemampuan untuk menghapus jabatan',
      },
      {
        key: 'position:read',
        name: 'Daftar Jabatan',
        description: 'Kemampuan untuk melihat daftar jabatan',
      },
      {
        key: 'employee:create',
        name: 'Buat Karyawan',
        description: 'Kemampuan untuk membuat karyawan baru',
      },
      {
        key: 'employee:update',
        name: 'Ubah Karyawan',
        description: 'Kemampuan untuk mengubah informasi karyawan',
      },
      {
        key: 'employee:delete',
        name: 'Hapus Karyawan',
        description: 'Kemampuan untuk menghapus karyawan',
      },
      {
        key: 'employee:detail',
        name: 'Detail Karyawan',
        description: 'Kemampuan untuk melihat detail karyawan',
      },
      {
        key: 'employee:read',
        name: 'Daftar Karyawan',
        description: 'Kemampuan untuk melihat daftar karyawan',
      },
      {
        key: 'employee:activate',
        name: 'Mengaktifkan Karyawan',
        description: 'Kemampuan untuk mengaktifkan karyawan',
      },
      {
        key: 'employee:deactivate',
        name: 'Menonaktifkan Karyawan',
        description: 'Kemampuan untuk menonaktifkan karyawan',
      },
      {
        key: 'employee:read-salary',
        name: 'Melihat gaji karyawan',
        description: 'Kemampuan untuk melihat gaji karyawan',
      },
      {
        key: 'cash-advance:create',
        name: 'Buat Kasbon',
        description: 'Kemampuan untuk membuat permintaan kasbon',
      },
      {
        key: 'cash-advance:update',
        name: 'Ubah Kasbon',
        description: 'Kemampuan untuk mengubah permintaan kasbon',
      },
      {
        key: 'cash-advance:delete',
        name: 'Hapus Kasbon',
        description: 'Kemampuan untuk menghapus permintaan kasbon',
      },
      {
        key: 'cash-advance:read',
        name: 'Daftar Kasbon',
        description: 'Kemampuan untuk melihat daftar kasbon',
      },
      {
        key: 'cash-advance:total',
        name: 'Total Kasbon',
        description: 'Kemampuan untuk melihat total jumlah kasbon',
      },
      {
        key: 'cash-advance:chart',
        name: 'Grafik Kasbon',
        description: 'Kemampuan untuk melihat grafik kasbon',
      },
      {
        key: 'attendance:create',
        name: 'Buat Kehadiran',
        description: 'Kemampuan untuk membuat catatan kehadiran',
      },
      {
        key: 'attendance:update',
        name: 'Ubah Kehadiran',
        description: 'Kemampuan untuk mengubah catatan kehadiran',
      },
      {
        key: 'attendance:read',
        name: 'Daftar Kehadiran',
        description: 'Kemampuan untuk melihat daftar kehadiran',
      },
      {
        key: 'overtime:create',
        name: 'Buat Lembur',
        description: 'Kemampuan untuk membuat catatan lembur',
      },
      {
        key: 'overtime:update',
        name: 'Ubah Lembur',
        description: 'Kemampuan untuk mengubah catatan lembur',
      },
      {
        key: 'overtime:delete',
        name: 'Hapus Lembur',
        description: 'Kemampuan untuk menghapus catatan lembur',
      },
      {
        key: 'overtime:detail',
        name: 'Detail Lembur',
        description: 'Kemampuan untuk melihat detail lembur',
      },
      {
        key: 'overtime:read',
        name: 'Daftar Lembur',
        description: 'Kemampuan untuk melihat daftar lembur',
      },

      {
        key: 'recap:create',
        name: 'Buat Rekap',
        description: 'Kemampuan untuk membuat laporan rekap',
      },
      {
        key: 'recap:update',
        name: 'Ubah Rekap',
        description: 'Kemampuan untuk mengubah laporan rekap',
      },
      {
        key: 'recap:delete',
        name: 'Hapus Rekap',
        description: 'Kemampuan untuk menghapus laporan rekap',
      },
      {
        key: 'recap:detail',
        name: 'Detail Rekap',
        description: 'Kemampuan untuk melihat detail rekap',
      },
      {
        key: 'recap:read',
        name: 'Daftar Rekap',
        description: 'Kemampuan untuk melihat daftar rekap',
      },
      {
        key: 'competency:create',
        name: 'Buat kompetensi',
        description: 'Kemampuan untuk membuat kompetensi',
      },
      {
        key: 'competency:update',
        name: 'Ubah kompetensi',
        description: 'Kemampuan untuk mengubah kompetensi',
      },
      {
        key: 'competency:delete',
        name: 'Hapus kompetensi',
        description: 'Kemampuan untuk menghapus kompetensi',
      },
    ],
  },
  {
    name: 'project',
    permissions: [
      {
        key: 'project:create',
        name: 'Buat Proyek',
        description: 'Kemampuan untuk membuat proyek baru',
      },
      {
        key: 'project:update',
        name: 'Ubah Proyek',
        description: 'Kemampuan untuk mengubah informasi proyek',
      },
      {
        key: 'project:delete',
        name: 'Hapus Proyek',
        description: 'Kemampuan untuk menghapus proyek',
      },
      {
        key: 'project:detail',
        name: 'Detail Proyek',
        description: 'Kemampuan untuk melihat detail proyek',
      },
      {
        key: 'project:archive',
        name: 'Arsip Proyek',
        description: 'Kemampuan untuk mengarsip proyek',
      },
      {
        key: 'project:read-value',
        name: 'Melihat nilai proyek',
        description: 'Kemampuan untuk membaca nilai proyek',
      },
      {
        key: 'project:upload-attachment',
        name: 'Upload lampiran proyek',
        description: 'Kemampuan untuk mengupload proyek',
      },
      {
        key: 'project:read-secret-attachment',
        name: 'Melihat lampiran rahasia',
        description: 'Kemampuan untuk melihat lampiran rahasia proyek',
      },
      {
        key: 'project:delete-attachment',
        name: 'Hapus lampiran',
        description: 'Kemampuan untuk menghapus lampiran proyek',
      },
      {
        key: 'project:borrow-goods',
        name: 'Pinjam barang',
        description: 'Kemampuan untuk meminjam alat untuk proyek',
      },

      {
        key: 'label:create',
        name: 'Buat Label',
        description: 'Kemampuan untuk membuat label baru',
      },
      {
        key: 'label:update',
        name: 'Ubah Label',
        description: 'Kemampuan untuk mengubah label',
      },
      {
        key: 'label:delete',
        name: 'Hapus Label',
        description: 'Kemampuan untuk menghapus label',
      },

      {
        key: 'client:create',
        name: 'Buat Klien',
        description: 'Kemampuan untuk menambahkan klien baru',
      },
      {
        key: 'client:update',
        name: 'Ubah Klien',
        description: 'Kemampuan untuk mengubah informasi klien',
      },
      {
        key: 'client:delete',
        name: 'Hapus Klien',
        description: 'Kemampuan untuk menghapus klien',
      },
      {
        key: 'client:read',
        name: 'Daftar Klien',
        description: 'Kemampuan untuk melihat daftar klien',
      },

      {
        key: 'company:create',
        name: 'Buat Perusahaan',
        description: 'Kemampuan untuk membuat perusahaan klien baru',
      },
      {
        key: 'company:update',
        name: 'Ubah Perusahaan',
        description: 'Kemampuan untuk mengubah informasi perusahaan klien',
      },
      {
        key: 'company:delete',
        name: 'Hapus Perusahaan',
        description: 'Kemampuan untuk menghapus perusahaan klien',
      },
    ],
  },
  {
    name: 'inventory',
    permissions: [
      {
        key: 'item:create',
        name: 'Buat Barang',
        description: 'Kemampuan untuk menambahkan barang baru ke inventory',
      },
      {
        key: 'item:update',
        name: 'Ubah Barang',
        description: 'Kemampuan untuk mengubah informasi barang',
      },
      {
        key: 'item:delete',
        name: 'Hapus Barang',
        description: 'Kemampuan untuk menghapus barang dari inventory',
      },
      {
        key: 'item:detail',
        name: 'Detail Barang',
        description: 'Kemampuan untuk melihat detail barang',
      },

      {
        key: 'transaction:create',
        name: 'Buat transaksi barang',
        description: 'Kemampuan untuk mencatat transaksi',
      },
      {
        key: 'transaction:update',
        name: 'Ubah transaksi barang',
        description: 'Kemampuan untuk mengubah transaksi',
      },
      {
        key: 'transaction:delete',
        name: 'Hapus transaksi barang',
        description: 'Kemampuan untuk menghapus transaksi',
      },
      {
        key: 'transaction:returned',
        name: 'Daftar Barang Masuk',
        description: 'Kemampuan mengembalikan barang',
      },

      {
        key: 'supplier:create',
        name: 'Buat Supplier',
        description: 'Kemampuan untuk menambahkan supplier baru',
      },
      {
        key: 'supplier:update',
        name: 'Ubah Supplier',
        description: 'Kemampuan untuk mengubah informasi supplier',
      },
      {
        key: 'supplier:delete',
        name: 'Hapus Supplier',
        description: 'Kemampuan untuk menghapus supplier',
      },
      {
        key: 'supplier:detail',
        name: 'Detail Supplier',
        description: 'Kemampuan untuk melihat detail supplier',
      },
    ],
  },
  {
    name: 'admin',
    permissions: [
      {
        key: 'user:create',
        name: 'Buat User',
        description: 'Kemampuan untuk membuat user baru dalam sistem',
      },
      {
        key: 'user:update',
        name: 'Ubah User',
        description: 'Kemampuan untuk mengubah informasi user',
      },
      {
        key: 'user:delete',
        name: 'Hapus User',
        description: 'Kemampuan untuk menghapus user dari sistem',
      },
      {
        key: 'user:detail',
        name: 'Detail User',
        description: 'Kemampuan untuk melihat detail informasi user',
      },
      {
        key: 'user:read',
        name: 'Daftar User',
        description: 'Kemampuan untuk melihat daftar user',
      },
      {
        key: 'user:change-role',
        name: 'Ganti Role User',
        description: 'Kemampuan untuk mengubah role yang dimiliki user',
      },
      {
        key: 'user:activate',
        name: 'Aktivasi User',
        description: 'Kemampuan untuk mengaktifkan user yang nonaktif',
      },
      {
        key: 'user:deactivate',
        name: 'Deaktivasi User',
        description: 'Kemampuan untuk menonaktifkan user yang aktif',
      },
      {
        key: 'role:create',
        name: 'Buat Role',
        description: 'Kemampuan untuk membuat role baru',
      },
      {
        key: 'role:update',
        name: 'Ubah Role',
        description: 'Kemampuan untuk mengubah informasi role',
      },
      {
        key: 'role:delete',
        name: 'Hapus Role',
        description: 'Kemampuan untuk menghapus role',
      },
      {
        key: 'role:detail',
        name: 'Detail Role',
        description: 'Kemampuan untuk melihat detail role',
      },
      {
        key: 'role:read',
        name: 'Daftar Role',
        description: 'Kemampuan untuk melihat daftar role',
      },
      {
        key: 'role:permission-update',
        name: 'Ubah Permission Role',
        description: 'Kemampuan untuk mengubah permission yang dimiliki role',
      },
    ],
  },
]

async function main() {
  // Create board containers
  for (let i = 0; i < 4; i++) {
    let id = `container-${generateUUID()}`
    await prisma.boardContainer.create({
      data: {
        id,
        name: BOARD_NAMES[i],
        color: BOARD_COLORS[i],
        position: i,
      },
    })
  }

  for (let i = 0; i < 2; i++) {
    await prisma.projectLabel.create({
      data: {
        name: LABELS_NAMES[i],
        color: LABELS_COLORS[i],
      },
    })
  }

  // create group permission
  const groups = GROUP_PERMISSION.map((group) => ({
    name: group.name,
  }))

  const createdGroups = await Promise.all(
    groups.map((group) =>
      prisma.permissionGroup.create({
        data: group,
      })
    )
  )

  const groupIdMap = createdGroups.reduce((acc, group) => {
    acc[group.name] = group.id
    return acc
  }, {} as Record<string, number>)

  const permissions = GROUP_PERMISSION.flatMap((group) =>
    group.permissions.map((permission) => ({
      key: permission.key,
      name: permission.name,
      description: permission.description,
      groupId: groupIdMap[group.name],
    }))
  )

  // create permissions
  await prisma.permission.createMany({
    data: permissions,
  })

  // Create Superadmin role with all permissions
  const superadminRole = await prisma.role.create({
    data: {
      name: 'Superadmin',
      description: 'Super Administrator with full access',
    },
  })

  const hashedPassword = await hash('password', 10)

  await prisma.user.create({
    data: {
      name: process.env.NAME as string,
      email: process.env.EMAIL as string,
      phoneNumber: process.env.PHONE as string,
      password: hashedPassword,
      roleId: superadminRole.id,
    },
  })

  console.log('Seeding completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
