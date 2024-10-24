export default class Message {
  name: string = ''
  constructor(name: string) {
    this.name = name
  }

  public successCreate = () => `${this.name} berhasil disimpan`
  public successUpdate = () => `${this.name} berhasil diperbarui`
  public successDelete = () => `${this.name} berhasil dihapus`
  public successRead = () => `${this.name} berhasil didapatkan`
  public notfound = () => `${this.name} tidak ditemukan`
  public notfoundCustom = (field: string) => `${field} tidak ditemukan`
  public successReadField = (field: string) =>
    `data ${field} berhasil didapatkan`
  public successUpdateField = (field: string) =>
    `data ${field} dari ${this.name} ini berhasil diperbarui`
  public successCreateField = (field: string) =>
    `data ${field} untuk ${this.name} ini berhasil disimpan`
  public successDeleteField = (field: string) =>
    `data ${field} untuk ${this.name} ini berhasil dihapus`
  public successActive = () => `${this.name} berhasil diaktifkan`
  public successInactive = () => `${this.name} berhasil dinonaktifkan`
  public customMessage = (message: string) => `data ${this.name} ${message}`

  public fileRequired = (field?: string) => `${field ?? 'Photo'} wajib diisi`
}
