import * as React from 'react'
import { MemoryRouter } from 'react-router'

import { HostRules } from 'redirector-client'
import HostRulesList from '../../src/components/HostRulesList'
import Loader from '../../src/components/Loader'
import ErrorView from '../../src/components/ErrorView'
import HostRulesView, { OnDeleteHostRules } from '../../src/components/HostRulesView'
import ButtonLink from '../../src/components/ButtonLink'

import { ConfigApiMock } from '../mocks/ConfigApiMock'
import { randomHostRules } from '../factories/HostRulesFactory'
import { ReactWrapper, mount } from 'enzyme'
import { randomArray } from '../factories/ArrayFactory'
import { randomResponse } from '../factories/ResponseFactory'

describe('HostRulesList', () => {
  let configApiMock: ConfigApiMock
  let hostRulesListWrapper: ReactWrapper

  let renderHostRulesList = () =>
    hostRulesListWrapper = mount(<MemoryRouter>
      <HostRulesList configApi={configApiMock} />
    </MemoryRouter>)

  beforeEach(() => {
    configApiMock = new ConfigApiMock()
  })

  describe('before loaded', () => {
    beforeEach(() => {
      configApiMock.listHostRulesMock.mockResolvedValue([randomHostRules()])

      renderHostRulesList()
    })

    it('render Loader', () => {
      expect(hostRulesListWrapper.find(Loader)).toHaveLength(1)

      return configApiMock.listHostRules()
    })
  })

  describe('on list load error', () => {
    let errorResponse: Response

    beforeEach(() => {
      errorResponse = new Response('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized',
      })

      let callback = () => Promise.reject(errorResponse)
      let promise = Promise.reject().catch(callback)
      configApiMock.listHostRulesMock.mockImplementation(() => promise)

      renderHostRulesList()

      return promise
        .catch(() => hostRulesListWrapper = hostRulesListWrapper.update())
    })

    it('render ErrorView', () => {
      let errorView = hostRulesListWrapper.update().find(ErrorView).first()
      expect(errorView.prop('response')).toEqual(errorResponse)
    })
  })

  describe('on list load success', () => {
    let hostRulesList: Array<HostRules>

    beforeEach(() => {
      hostRulesList = randomArray(randomHostRules, 1, 3)

      let callback = () => Promise.resolve(hostRulesList)
      let promise = Promise.resolve().then(callback)
      configApiMock.listHostRulesMock.mockImplementation(() => promise)

      renderHostRulesList()

      return promise
        .then(() => hostRulesListWrapper = hostRulesListWrapper.update())
    })

    it('have new link', () => {
      let newButton = hostRulesListWrapper
        .find(ButtonLink)
        .filter({ name: 'new' })
        .first()

      expect(newButton.prop('to')).toEqual('/host_rules_list/new')
      expect(newButton.text()).toEqual('New')
    })

    it('render host rule view', () => {
      let elList = hostRulesListWrapper.find(HostRulesView)
      expect(elList.map(el => el.prop('hostRules'))).toEqual(hostRulesList)
    })

    describe('on delete', () => {
      let deleteHostRules: () => void

      beforeEach(() => {
        let index = Math.floor(hostRulesList.length * Math.random())
        let hostRulesView = hostRulesListWrapper.find(HostRulesView).at(index)
        let hostRules = hostRulesList[index]

        let onDelete: OnDeleteHostRules = hostRulesView.prop('onDelete')

        deleteHostRules = () => onDelete(hostRules.host)
      })

      describe('on delete error', () => {
        let errorResponse: Response

        beforeEach(() => {
          errorResponse = randomResponse()
          configApiMock.deleteHostRulesMock.mockRejectedValue(errorResponse)

          deleteHostRules()

          return configApiMock.deleteHostRules()
            .catch(() => hostRulesListWrapper = hostRulesListWrapper.update())
        })

        it('not delete host', () => {
          let list = hostRulesListWrapper
            .find(HostRulesView)
            .map(el => el.prop('hostRules'))

          expect(list).toEqual(hostRulesList)
        })
      })

      describe('when delete success', () => {
        beforeEach(() => {
          configApiMock.deleteHostRulesMock.mockResolvedValue(undefined)

          deleteHostRules()

          return configApiMock.deleteHostRules()
            .then(() => hostRulesListWrapper = hostRulesListWrapper.update())
        })

        it('delete host', () => {
          expect(hostRulesListWrapper.find(HostRulesView))
            .toHaveLength(hostRulesList.length - 1)
        })
      })
    })
  })
})
