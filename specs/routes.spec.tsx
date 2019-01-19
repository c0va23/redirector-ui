import {
  ReactWrapper,
  mount,
} from 'enzyme'
import {
  internet,
  lorem,
} from 'faker'
import * as React from 'react'
import {
  MemoryRouter,
} from 'react-router-dom'

import HostRulesEdit from '../src/pages/HostRulesEdit'
import HostRulesNew from '../src/pages/HostRulesNew'
import LoginForm from '../src/pages/LoginForm'
import {
  defaultAuthorizedRoutes,
  defaultUnauthorizedRoutes,
} from '../src/routes'

import { randomHostRules } from './factories/HostRulesFactory'
import { ConfigApiMock } from './mocks/ConfigApiMock'

describe('defaultUnauthorizedRoutes', () => {
  const apiUrl = internet.url()
  const logIn = jest.fn()

  let routes: ReactWrapper
  const buildUnaAuthorizedRoutes =
    (initialEntries?: string[]) =>
      mount(
        <MemoryRouter initialEntries={initialEntries}>
          {defaultUnauthorizedRoutes({ apiUrl, logIn })}
        </MemoryRouter>,
      )

  describe('default path', () => {
    beforeEach(() => {
      routes = buildUnaAuthorizedRoutes()
    })

    it('render LoginForm', () => {
      expect(routes.find(LoginForm).props()).toEqual({ apiUrl, logIn })
    })
  })

  describe('custom path', () => {
    beforeEach(() => {
      routes = buildUnaAuthorizedRoutes([lorem.word()])
    })

    it('redirect to /login', () => {
      let switchEl = routes.children()
      expect(switchEl.prop('history').location.pathname).toEqual('/login')
    })

    it('render LoginForm', () => {
      expect(routes.find(LoginForm).props()).toEqual({ apiUrl, logIn })
    })
  })
})

describe('defaultAuthorizedRoutes', () => {
  let configApi: ConfigApiMock

  let routes: ReactWrapper
  const buildAuthorizedRoutes =
    (initialEntries?: string[]) =>
      mount(
        <MemoryRouter initialEntries={initialEntries}>
          {defaultAuthorizedRoutes({ configApi })}
        </MemoryRouter>,
      )

  const currentPath = () =>
    routes
      .children()
      .prop('history')
      .location
      .pathname

  describe('default path', () => {
    beforeEach(() => {
      configApi = new ConfigApiMock()
      configApi.listHostRulesMock.mockResolvedValue([])
      routes = buildAuthorizedRoutes()
    })

    it('redirect to /host_rules_list', () => {
      expect(currentPath()).toEqual('/host_rules_list')
    })
  })

  describe('root path', () => {
    beforeEach(() => {
      routes = buildAuthorizedRoutes(['/'])
    })

    it('redirect to /host_rules_list', () => {
      expect(currentPath()).toEqual('/host_rules_list')
    })
  })

  describe('edit path', () => {
    let path: string

    beforeEach(() => {
      let hostRules = randomHostRules()
      configApi.getHostRuleMock.mockResolvedValue(hostRules)

      path = `/host_rules_list/${hostRules.host}/edit`
      routes = buildAuthorizedRoutes([path])
    })

    it('not redirect', () => {
      expect(currentPath()).toEqual(path)
    })

    it('render HostRulesEdit', () => {
      expect(routes.find(HostRulesEdit).prop('configApi')).toEqual(configApi)
    })
  })

  describe('new path', () => {
    let path = '/host_rules_list/new'

    beforeEach(() => {
      routes = buildAuthorizedRoutes([path])
    })

    it('not redirect', () => {
      expect(currentPath()).toEqual(path)
    })

    it('render HostRulesEdit', () => {
      expect(routes.find(HostRulesNew).prop('configApi')).toEqual(configApi)
    })
  })
})
