export const permissions = [
  {
    name: 'employee',
    permissions: [
      {
        key: 'employee:create',
        name: 'Buat pegawai',
        description: 'Akses untuk membuat data pegawai baru',
      },
      {
        key: 'employee:update',
        name: 'Ubah pegawai',
        description: 'Akses untuk mengubah data pegawai',
      },
      {
        key: 'employee:delete',
        name: 'Hapus pegawai',
        description: 'Akses untuk menghapus pegawai',
      },
      {
        key: 'employee:view',
        name: 'Lihat pegawai',
        description: 'Akses untuk melihat data pegawai',
      },
      {
        key: 'employee:read-salary',
        name: 'Melihat gaji pegawai',
        description: 'Akses untuk melihat gaji pegawai',
      },
      {
        key: 'cash-advance:create',
        name: 'Buat Kasbon',
        description: 'Akses untuk membuat data kasbon',
      },
      {
        key: 'cash-advance:update',
        name: 'Ubah Kasbon',
        description: 'Akses untuk mengubah data kasbon',
      },
      {
        key: 'cash-advance:delete',
        name: 'Hapus Kasbon',
        description: 'Akses untuk menghapus data kasbon',
      },
      {
        key: 'cash-advance:view',
        name: 'Lihat Kasbon',
        description: 'Akses untuk melihat data kasbon',
      },
      {
        key: 'cash-advance:total',
        name: 'Total Kasbon',
        description: 'Akses untuk melihat total jumlah kasbon',
      },
      {
        key: 'cash-advance:chart',
        name: 'Grafik Kasbon',
        description: 'Akses untuk melihat grafik kasbon',
      },
      {
        key: 'attendance:create',
        name: 'Buat Kehadiran',
        description: 'Akses untuk membuat data kehadiran',
      },
      {
        key: 'attendance:update',
        name: 'Ubah Kehadiran',
        description: 'Akses untuk mengubah data kehadiran',
      },
      {
        key: 'attendance:view',
        name: 'Lihat Kehadiran',
        description: 'Akses untuk melihat data kehadiran',
      },
      {
        key: 'overtime:create',
        name: 'Buat Lembur',
        description: 'Akses untuk membuat data lembur',
      },
      {
        key: 'overtime:update',
        name: 'Ubah Lembur',
        description: 'Akses untuk mengubah data lembur',
      },
      {
        key: 'overtime:delete',
        name: 'Hapus Lembur',
        description: 'Akses untuk menghapus data lembur',
      },
      {
        key: 'overtime:view',
        name: 'Lihat Lembur',
        description: 'Akses untuk melihat data lembur',
      },
    ],
  },
  {
    name: 'project',
    permissions: [
      {
        key: 'project:view',
        name: 'Lihat Proyek',
        description: 'Akses untuk melihat proyek baru',
      },
      {
        key: 'project:create',
        name: 'Buat Proyek',
        description: 'Akses untuk membuat proyek baru',
      },
      {
        key: 'project:update',
        name: 'Ubah Proyek',
        description: 'Akses untuk mengubah informasi proyek',
      },
      {
        key: 'project:delete',
        name: 'Hapus Proyek',
        description: 'Akses untuk menghapus proyek',
      },
      {
        key: 'project:assignee',
        name: 'Menugaskan Pegawai',
        description: 'Akses untuk menugaskan pegawai pada proyek',
      },
      {
        key: 'project:read-value',
        name: 'Melihat nilai proyek',
        description: 'Akses untuk mengetahui nilai proyek',
      },
      {
        key: 'project:upload-attachment',
        name: 'Upload lampiran proyek',
        description: 'Akses untuk mengupload proyek',
      },
      {
        key: 'project:read-secret-attachment',
        name: 'Melihat lampiran rahasia',
        description: 'Akses untuk melihat lampiran rahasia proyek',
      },
      {
        key: 'project:delete-attachment',
        name: 'Hapus lampiran',
        description: 'Akses untuk menghapus lampiran proyek',
      },
      {
        key: 'project:borrow-inventory',
        name: 'Pinjam Inventaris',
        description: 'Akses untuk meminjam invenataris untuk keperluan proyek',
      },

      {
        key: 'client:create',
        name: 'Buat Klien',
        description: 'Akses untuk menambahkan klien baru',
      },
      {
        key: 'client:update',
        name: 'Ubah Klien',
        description: 'Akses untuk mengubah informasi klien',
      },
      {
        key: 'client:delete',
        name: 'Hapus Klien',
        description: 'Akses untuk menghapus klien',
      },
      {
        key: 'client:view',
        name: 'Lihat Klien',
        description: 'Akses untuk melihat data klien',
      },

      {
        key: 'company:create',
        name: 'Buat Perusahaan',
        description: 'Akses untuk membuat perusahaan klien baru',
      },
      {
        key: 'company:update',
        name: 'Ubah Perusahaan',
        description: 'Akses untuk mengubah informasi perusahaan klien',
      },
      {
        key: 'company:delete',
        name: 'Hapus Perusahaan',
        description: 'Akses untuk menghapus perusahaan klien',
      },
    ],
  },
  {
    name: 'inventory',
    permissions: [
      {
        key: 'item:view',
        name: 'Lihat Barang',
        description: 'Akses untuk melihat barang di inventory',
      },
      {
        key: 'item:create',
        name: 'Buat Barang',
        description: 'Akses untuk menambahkan barang baru ke inventory',
      },
      {
        key: 'item:update',
        name: 'Ubah Barang',
        description: 'Akses untuk mengubah informasi barang',
      },
      {
        key: 'item:delete',
        name: 'Hapus Barang',
        description: 'Akses untuk menghapus barang dari inventory',
      },

      {
        key: 'transaction:view',
        name: 'Lihat transaksi',
        description: 'Akses untuk mencatat transaksi',
      },
      {
        key: 'transaction:create',
        name: 'Buat transaksi',
        description: 'Akses untuk mencatat transaksi',
      },
      {
        key: 'transaction:update',
        name: 'Ubah transaksi',
        description: 'Akses untuk mengubah transaksi',
      },
      {
        key: 'transaction:delete',
        name: 'Hapus transaksi',
        description: 'Akses untuk menghapus transaksi',
      },

      {
        key: 'supplier:create',
        name: 'Buat Supplier',
        description: 'Akses untuk menambahkan supplier baru',
      },
      {
        key: 'supplier:update',
        name: 'Ubah Supplier',
        description: 'Akses untuk mengubah informasi supplier',
      },
      {
        key: 'supplier:delete',
        name: 'Hapus Supplier',
        description: 'Akses untuk menghapus supplier',
      },
    ],
  },
  {
    name: 'User',
    permissions: [
      {
        key: 'user:create',
        name: 'Buat User',
        description: 'Akses untuk membuat user baru dalam sistem',
      },
      {
        key: 'user:update',
        name: 'Ubah User',
        description: 'Akses untuk mengubah informasi user',
      },
      {
        key: 'user:delete',
        name: 'Hapus User',
        description: 'Akses untuk menghapus user dari sistem',
      },
      {
        key: 'user:view',
        name: 'Lihat User',
        description: 'Akses untuk melihat user',
      },
      {
        key: 'user:reset-password',
        name: 'Reset Password',
        description: 'Akses untuk mereset password yang dimiliki user',
      },
      {
        key: 'user:change-role',
        name: 'Ganti Role User',
        description: 'Akses untuk mengubah role yang dimiliki user',
      },

      {
        key: 'role:create',
        name: 'Buat Role',
        description: 'Akses untuk membuat role baru',
      },
      {
        key: 'role:update',
        name: 'Ubah Role',
        description: 'Akses untuk mengubah informasi role',
      },
      {
        key: 'role:delete',
        name: 'Hapus Role',
        description: 'Akses untuk menghapus role',
      },
      {
        key: 'role:view',
        name: 'Lihat Role',
        description: 'Akses untuk melihat data role',
      },
      {
        key: 'role:permission-update',
        name: 'Ubah Permission Role',
        description: 'Akses untuk mengubah permission yang dimiliki role',
      },
    ],
  },
]
