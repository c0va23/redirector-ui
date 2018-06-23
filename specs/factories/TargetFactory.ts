import { Target } from 'redirector-client'

import { randomPath } from './PathFactory'

export const DEFAULT_HTTP_CODE: number = 301

export function newTarget (): Target {
  return {
    path: '',
    httpCode: DEFAULT_HTTP_CODE,
  }
}

export function randomHttpCode (): number {
  return 300 + Math.floor(Math.random() * 100)
}

export function randomTarget (): Target {
  return {
    path: randomPath(),
    httpCode: randomHttpCode(),
  }
}
