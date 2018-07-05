import * as React from 'react'
import { render } from 'react-dom'

import * as log from 'loglevel'

import App from './app'

const logger = log.getLogger('index')

let app = document.getElementById('app')

if (null !== app) {
  let apiUri = app.dataset['apiUri']

  render(<App apiUri={apiUri} />, app)
} else {
  logger.error('Root element not found')
}
