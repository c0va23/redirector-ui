export class StorageMock implements Storage {
  setItemMock = jest.fn()
  removeItemMock = jest.fn()
  keyMock = jest.fn()
  getItemMock = jest.fn()
  clearMock = jest.fn()

  clear = this.clearMock
  getItem = this.getItemMock
  key = this.keyMock
  removeItem = this.removeItemMock
  setItem = this.setItemMock

  constructor (
    readonly length: number = 0,
  ) {}
}
