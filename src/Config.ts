import {
  ConfigApi,
  ConfigApiInterface,
} from 'redirector-client'

export default interface Config {
  apiUrl: string
  username: string
  password: string
}

export type ConfigApiBuilder = (config: Config) => ConfigApiInterface

export function defaultConfigApiBuilder (config: Config): ConfigApiInterface {
  return new ConfigApi({
    basePath: config.apiUrl,
    username: config.username,
    password: config.password,
  })
}

export const CONFIG_KEY = 'config'

export interface ConfigStore {
  load (): Config | undefined
  store (config: Config): void
  clear (): void
}

export class DefaultConfigStore implements ConfigStore {
  constructor (readonly storage: Storage) {}

  load (): Config | undefined {
    const configJson = this.storage.getItem(CONFIG_KEY)
    if (null === configJson) return undefined
    return JSON.parse(configJson)
  }

  store (config: Config) {
    const configJson = JSON.stringify(config)
    this.storage.setItem(CONFIG_KEY, configJson)
  }

  clear () {
    this.storage.removeItem(CONFIG_KEY)
  }
}
