import * as React from 'react'
import { render } from 'react-dom'

import * as log from 'loglevel'

import App from './App'
import {
  DefaultConfigStore,
  defaultConfigApiBuilder,
} from './Config'

const logger = log.getLogger('index')

let app = document.getElementById('app')

if (null !== app) {
  let apiUrl = app.dataset['apiUrl']
  let configStore = new DefaultConfigStore(sessionStorage)

  render(<App
    apiUrl={apiUrl}
    configApiBuilder={defaultConfigApiBuilder}
    configStore={configStore}
  />, app)
} else {
  logger.error('Root element not found')
}
