import * as log from 'loglevel'
import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'

import App from './App'
import {
  DefaultConfigStore,
  defaultConfigApiBuilder,
} from './Config'
import {
  defaultAuthorizedRoutes,
  defaultUnauthorizedRoutes,
} from './routes'

const logger = log.getLogger('index')

let app = document.getElementById('app')

if (null !== app) {
  let apiUrl = app.dataset['apiUrl']
  let configStore = new DefaultConfigStore(sessionStorage)

  render(
    <HashRouter>
      <App
        apiUrl={apiUrl}
        configApiBuilder={defaultConfigApiBuilder}
        configStore={configStore}
        authorizedRoutes={defaultAuthorizedRoutes}
        unauthorizedRoutes={defaultUnauthorizedRoutes}
      />
    </HashRouter>,
    app,
  )
} else {
  logger.error('Root element not found')
}
