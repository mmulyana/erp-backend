export const permissions = [
  {
    name: 'Halaman',
    permissions: [
      {
        key: 'pages:hris-dashboard',
        name: 'Dashboard HRIS',
        description: 'Akses untuk halaman dashboard HRIS',
      },
      {
        key: 'pages:hris-employee',
        name: 'Halaman Pegawai',
        description: 'Akses untuk halaman pegawai',
      },
      {
        key: 'pages:hris-attendance',
        name: 'Halaman Absensi',
        description: 'Akses untuk halaman absensi',
      },
      {
        key: 'pages:hris-overtime',
        name: 'Halaman Lembur',
        description: 'Akses untuk halaman lembur',
      },
      {
        key: 'pages:hris-cash-advance',
        name: 'Halaman Kasbon',
        description: 'Akses untuk halaman kasbon',
      },
      {
        key: 'pages:hris-payroll',
        name: 'Halaman Gaji',
        description: 'Akses untuk halaman gaji',
      },
      {
        key: 'pages:hris-slip-gaji',
        name: 'Halaman Slip Gaji',
        description: 'Akses untuk halaman slip gaji',
      },
      {
        key: 'pages:project-dashboard',
        name: 'Dashboard Proyek',
        description: 'Akses untuk halaman dashboard proyek',
      },
      {
        key: 'pages:project-list',
        name: 'Halaman Proyek',
        description: 'Akses untuk halaman proyek',
      },
      {
        key: 'pages:project-client',
        name: 'Halaman Klien',
        description: 'Akses untuk halaman klien',
      },
      {
        key: 'pages:project-client-company',
        name: 'Halaman Perusahaan Klien',
        description: 'Akses untuk halaman perusahaan klien',
      },
      {
        key: 'pages:inventory-dashboard',
        name: 'Dashboard Inventaris',
        description: 'Akses untuk halaman dashboard inventaris',
      },
      {
        key: 'pages:inventory-item',
        name: 'Halaman Barang',
        description: 'Akses untuk halaman barang inventaris',
      },
      {
        key: 'pages:inventory-warehouse',
        name: 'Halaman Gudang',
        description: 'Akses untuk halaman gudang',
      },
      {
        key: 'pages:inventory-brand',
        name: 'Halaman Merek',
        description: 'Akses untuk halaman merek',
      },
      {
        key: 'pages:inventory-supplier',
        name: 'Halaman Supplier',
        description: 'Akses untuk halaman supplier',
      },
      {
        key: 'pages:inventory-stock-in',
        name: 'Halaman Stok Masuk',
        description: 'Akses untuk halaman stok masuk',
      },
      {
        key: 'pages:inventory-stock-out',
        name: 'Halaman Stok Keluar',
        description: 'Akses untuk halaman stok keluar',
      },
      {
        key: 'pages:inventory-stock-borrow',
        name: 'Halaman Stok Pinjam',
        description: 'Akses untuk halaman stok pinjam',
      },
      {
        key: 'pages:admin-user',
        name: 'Halaman User',
        description: 'Akses untuk halaman user',
      },
      {
        key: 'pages:admin-role',
        name: 'Halaman Role',
        description: 'Akses untuk halaman role',
      },
    ],
  },
  {
    name: 'Pegawai',
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
    ],
  },
  {
    name: 'Kasbon',
    permissions: [
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
    ],
  },
  {
    name: 'Absensi',
    permissions: [
      {
        key: 'attendance:create',
        name: 'Buat Kehadiran',
        description: 'Akses untuk membuat data kehadiran',
      },
      {
        key: 'attendance:view',
        name: 'Lihat Kehadiran',
        description: 'Akses untuk melihat data kehadiran',
      },
    ],
  },
  {
    name: 'Lembur',
    permissions: [
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
    name: 'Proyek',
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
        description: 'Akses untuk meminjam inventaris untuk keperluan proyek',
      },
      {
        key: 'project:stock-out',
        name: 'Pemakaian',
        description: 'Akses melakukan stok keluar untuk keperluan proyek',
      },
    ],
  },
  {
    name: 'Klien',
    permissions: [
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
    name: 'Inventaris',
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
    ],
  },
  {
    name: 'Transaksi',
    permissions: [
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
    ],
  },
  {
    name: 'Supplier',
    permissions: [
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
    ],
  },
  {
    name: 'Role',
    permissions: [
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
