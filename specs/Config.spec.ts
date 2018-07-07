import {
  ConfigApi,
  ConfigApiInterface,
} from 'redirector-client'

import Config, {
  CONFIG_KEY,
  DefaultConfigStore,
  defaultConfigApiBuilder,
} from '../src/Config'

import { StorageMock } from './mocks/StorageMock'

import { randomConfig } from './factories/ConfigFactory'

describe('ConfigStore', () => {
  let storageMock: StorageMock
  let configStore: DefaultConfigStore

  beforeEach(() => {
    storageMock = new StorageMock()
    configStore = new DefaultConfigStore(storageMock)
  })

  describe('load()', () => {
    describe('when store empty', () => {
      let config: Config | undefined
      beforeEach(() => {
        storageMock.getItemMock.mockReturnValue(null)
        config = configStore.load()
      })

      it('return undefined', () => {
        expect(config).toBe(undefined)
      })

      it('call storage', () => {
        expect(storageMock.getItem).toHaveBeenCalledWith(CONFIG_KEY)
      })
    })

    describe('when store have valid json', () => {
      let sourceConfig: Config
      let config: Config | undefined
      beforeEach(() => {
        sourceConfig = randomConfig()
        storageMock.getItemMock.mockReturnValue(JSON.stringify(sourceConfig))
        config = configStore.load()
      })

      it('return valid config', () => {
        expect(config).toEqual(sourceConfig)
      })

      it('call storage', () => {
        expect(storageMock.getItem).toHaveBeenCalledWith(CONFIG_KEY)
      })
    })
  })

  describe('store', () => {
    let config: Config
    beforeEach(() => {
      config = randomConfig()
      configStore.store(config)
    })

    it('call storage', () => {
      expect(storageMock.setItem).toBeCalledWith(
        CONFIG_KEY, JSON.stringify(config))
    })
  })

  describe('clear', () => {
    beforeEach(() => configStore.clear())

    it('call storage.removeItem', () => {
      expect(storageMock.removeItem).toBeCalledWith(CONFIG_KEY)
    })
  })
})

describe('defaultConfigApiBuilder', () => {
  let config: Config
  let configApi: ConfigApiInterface

  beforeEach(() => {
    config = randomConfig()
    configApi = defaultConfigApiBuilder(config)
  })

  it('build config with api', () => {
    expect(configApi).toEqual(new ConfigApi({
      basePath: config.apiUrl,
      username: config.username,
      password: config.password,
    }))
  })
})
