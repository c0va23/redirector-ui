import * as React from 'react'
import { render } from 'react-dom'

import * as log from 'loglevel'

import App from './app'

const logger = log.getLogger('index')

let app = document.getElementById('app')

if (null !== app) {
  let apiUrl = app.dataset['apiUrl']

  render(<App apiUrl={apiUrl} />, app)
} else {
  logger.error('Root element not found')
}
