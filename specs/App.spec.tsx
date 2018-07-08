import * as React from 'react'

import Button from '@material-ui/core/Button'
import { MemoryRouter } from 'react-router-dom'

import { ReactWrapper, mount } from 'enzyme'
import { internet } from 'faker'

import { HostRules } from 'redirector-client'

import App, { AppProps } from '../src/App'
import Config from '../src/Config'
import HostRulesList, { HostRulesListProps } from '../src/pages/HostRulesList'
import LoginForm, { LoginFormProps } from '../src/pages/LoginForm'

import { randomConfig } from './factories/ConfigFactory'

import { randomArray } from './factories/ArrayFactory'
import { randomHostRules } from './factories/HostRulesFactory'
import { ConfigApiMock } from './mocks/ConfigApiMock'
import ConfigStoreMock from './mocks/ConfigStoreMock'

describe('App', () => {
  let app: ReactWrapper<AppProps>

  let apiUrl: string
  let configStore: ConfigStoreMock
  let configApi: ConfigApiMock
  let configApiBuilder = (_: Config) => configApi

  let buildApp = () =>
    mount(<MemoryRouter>
      <App
        apiUrl={apiUrl}
        configStore={configStore}
        configApiBuilder={configApiBuilder}
      />
    </MemoryRouter>)

  let findLogOutButton = () =>
    app
      .find(Button)
      .filter({ name: 'logOut' })
      .first()

  beforeEach(() => {
    apiUrl = internet.url()
    configStore = new ConfigStoreMock()
    configApi = new ConfigApiMock()
  })

  describe('unauthenticated', () => {
    beforeEach(() => {
      configStore.loadMock.mockReturnValue(undefined)
      app = buildApp()
    })

    it('render LoginForm with apiUrl', () => {
      expect(app.find(LoginForm).prop('apiUrl')).toEqual(apiUrl)
    })

    it('not render logOutButton', () => {
      expect(findLogOutButton()).toHaveLength(0)
    })

    describe('on logIn', () => {
      let config: Config
      let hostRulesList: Array<HostRules>

      beforeEach(() => {
        config = randomConfig()

        hostRulesList = randomArray(randomHostRules, 1, 3)
        configApi
          .listHostRulesMock
          .mockResolvedValue(hostRulesList)

        let loginForm: ReactWrapper<LoginFormProps> = app.find(LoginForm)
        loginForm
          .props()
          .logIn(config)

        app = app.update()
      })

      it('store config', () => {
        expect(configStore.storeMock).toBeCalledWith(config)
      })

      it('render host rules list', () => {
        let hostRulesListEl: ReactWrapper<HostRulesListProps> = app.find(HostRulesList).first()
        expect(hostRulesListEl.props().configApi).toEqual(configApi)
      })

      it('render logOut Button', () => {
        expect(findLogOutButton()).toHaveLength(1)
      })
    })
  })

  describe('authenticated', () => {
    let config: Config
    let hostRulesList: Array<HostRules>

    beforeEach(() => {
      config = randomConfig()
      configStore.loadMock.mockReturnValue(config)

      hostRulesList = randomArray(randomHostRules, 1, 3)
      configApi.listHostRulesMock.mockResolvedValue(hostRulesList)

      app = buildApp()
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
        expect(app.update().find(LoginForm)).toHaveLength(1)
      })
    })

    it('render host rules list', () => {
      let hostRulesListEl: ReactWrapper<HostRulesListProps> = app.find(HostRulesList).first()
      expect(hostRulesListEl.props().configApi).toEqual(configApi)
    })
  })
})
