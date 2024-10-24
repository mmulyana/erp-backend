export default class Message {
  name: string = ''
  constructor(name: string) {
    this.name = name
  }

  public successCreate = () => `${this.name} berhasil disimpan`
  public successUpdate = () => `${this.name} berhasil diperbarui`
  public successDelete = () => `${this.name} berhasil dihapus`
  public successRead = () => `${this.name} berhasil didapatkan`
  public successUpdateCustom = (field: string) =>
    `data ${field} dari ${this.name} ini berhasil diperbarui`
  public successCreateCustom = (field: string) =>
    `data ${field} untuk ${this.name} ini berhasil disimpan`
  public successDeleteCustom = (field: string) =>
    `data ${field} untuk ${this.name} ini berhasil dihapus`
  public successReadCustom = (field: string) =>
    `data ${field} berhasil didapatkan`
  public customNotFound = (field: string) => `${field} tidak ditemukan`

  public fileRequired = (field?: string) => `${field ?? 'Photo'} wajib diisi`
}
