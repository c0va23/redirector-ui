import { internet, lorem } from 'faker'

import Config from '../../src/Config'

export function randomConfig (): Config {
  return {
    apiUrl: internet.url(),
    username: lorem.word(),
    password: lorem.word(),
  }
}
