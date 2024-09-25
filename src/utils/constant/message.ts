export default class Message {
  name: string = ''
  constructor(name: string) {
    this.name = name
  }

  public successCreate = () => `${this.name} berhasil disimpan`
  public successUpdate = () => `${this.name} berhasil diperbarui`
  public successDelete = () => `${this.name} berhasil dihapus`
  public successRead = () => `${this.name} berhasil didapatkan`

  public fileRequired = (field?: string) => `${field ?? 'Photo'} wajib diisi`
}
