import { ConfigStore } from '../../src/Config'

export default class ConfigStoreMock implements ConfigStore {
  loadMock = jest.fn()
  storeMock = jest.fn()
  clearMock = jest.fn()

  load = this.loadMock
  store = this.storeMock
  clear = this.clearMock
}
