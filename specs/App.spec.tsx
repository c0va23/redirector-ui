import * as React from 'react'

import Button from '@material-ui/core/Button'
import { MemoryRouter } from 'react-router-dom'

import { ReactWrapper, mount } from 'enzyme'
import { internet } from 'faker'

import App, { AppProps } from '../src/App'
import Config from '../src/Config'
import {
  AuthorizedRoutesProps,
  UnauthorizedRoutesProps,
} from '../src/routes'

import { randomConfig } from './factories/ConfigFactory'

import { ConfigApiMock } from './mocks/ConfigApiMock'
import ConfigStoreMock from './mocks/ConfigStoreMock'
import {
  AuthorizedRoutesMock,
  UnauthorizedRoutesMock,
  mockedAuthorizedRoutes,
  mockedUnauthorizedRoutes,
} from './mocks/routesMocks'

describe('App', () => {
  let app: ReactWrapper<AppProps>

  let apiUrl: string
  let configStore: ConfigStoreMock
  let configApi: ConfigApiMock
  let configApiBuilder = (_: Config) => configApi

  let buildApp = () =>
    mount(
      <MemoryRouter>
        <App
          apiUrl={apiUrl}
          configStore={configStore}
          configApiBuilder={configApiBuilder}
          authorizedRoutes={mockedAuthorizedRoutes}
          unauthorizedRoutes={mockedUnauthorizedRoutes}
        />
      </MemoryRouter>,
    )

  let findLogOutButton = () =>
    app
      .find(Button)
      .filter({ name: 'logOut' })
      .first()

  beforeEach(() => {
    apiUrl = internet.url()
    configStore = new ConfigStoreMock()
    configApi = new ConfigApiMock()
    configApi.localesMock.mockResolvedValue([])
  })

  describe('unauthenticated', () => {
    let unauthorizedRoutes: ReactWrapper<UnauthorizedRoutesProps>

    beforeEach(() => {
      configStore.loadMock.mockReturnValue(undefined)
      app = buildApp()
      unauthorizedRoutes = app.find(UnauthorizedRoutesMock)
    })

    it('render unauthorized routes', () => {
      expect(unauthorizedRoutes.props().apiUrl).toEqual(apiUrl)
    })

    it('not render logOutButton', () => {
      expect(findLogOutButton()).toHaveLength(0)
    })

    describe('on logIn', () => {
      let config: Config

      beforeEach(() => {
        config = randomConfig()

        unauthorizedRoutes
          .props()
          .logIn(config)

        return configApi.locales().then(() => {
          app = app.update()
        })
      })

      it('store config', () => {
        expect(configStore.storeMock).toBeCalledWith(config)
      })

      it('render host rules list', () => {
        let authorizedRoutes: ReactWrapper<AuthorizedRoutesProps> =
          app.find(AuthorizedRoutesMock).first()
        expect(authorizedRoutes.props().configApi).toEqual(configApi)
      })

      it('render logOut Button', () => {
        expect(findLogOutButton()).toHaveLength(1)
      })
    })
  })

  describe('authenticated', () => {
    let config: Config

    beforeEach(() => {
      config = randomConfig()
      configStore.loadMock.mockReturnValue(config)

      app = buildApp()

      return configApi.locales().then(() => {
        app = app.update()
      })
    })

    describe('logOut button', () => {
      let logOutButton: ReactWrapper
      beforeEach(() => {
        logOutButton = findLogOutButton()
      })

      it('button exists', () => {
        expect(logOutButton).toHaveLength(1)
      })

      it('remove config on click', () => {
        logOutButton.simulate('click')
        expect(configStore.clearMock).toBeCalled()
      })

      it('render LoginForm on click', () => {
        logOutButton.simulate('click')
        expect(app.update().find(UnauthorizedRoutesMock)).toHaveLength(1)
      })
    })

    it('render authorized routes', () => {
      let authorizedRoutes: ReactWrapper<AuthorizedRoutesProps> =
        app.find(AuthorizedRoutesMock)
      expect(authorizedRoutes.props().configApi).toEqual(configApi)
    })
  })
})
