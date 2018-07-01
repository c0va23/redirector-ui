import * as React from 'react'
import { MemoryRouter, Route } from 'react-router'
import { History } from 'history'

import ButtonLink from '../../src/components/ButtonLink'
import ErrorView from '../../src/components/ErrorView'
import Loader from '../../src/components/Loader'
import { HostRules } from 'redirector-client'
import HostRulesEdit from '../../src/components/HostRulesEdit'
import HostRulesForm, {
  OnChange,
  OnSave,
  SuccessSaveCb,
  ErrorSaveCb,
} from '../../src/components/HostRulesForm'

import { ReactWrapper, mount } from 'enzyme'

import { ConfigApiMock } from '../mocks/ConfigApiMock'
import { randomHostRules } from '../factories/HostRulesFactory'
import { randomResponse } from '../factories/ResponseFactory'

describe('HostRulesEdit', () => {
  let configApiMock: ConfigApiMock
  let hostRules: HostRules
  let hostRulesEditWrapper: ReactWrapper

  let hostRulesEdit = () => hostRulesEditWrapper.find(HostRulesEdit).first()

  let hostRulesForm = () => hostRulesEditWrapper
    .update()
    .find(HostRulesForm)
    .first()

  let waitLoading = () =>
    configApiMock
      .getHostRule()
      .then(() => hostRulesEditWrapper = hostRulesEditWrapper.update())
      .catch(() => hostRulesEditWrapper = hostRulesEditWrapper.update())

  let buildHostRulesEdit = () =>
    hostRulesEditWrapper = mount(<MemoryRouter
      initialEntries={[`/host_rules_list/${hostRules.host}/edit`]}
      initialIndex={0}
    >
      <Route path='/host_rules_list/:host/edit'>
        <HostRulesEdit
          configApi={configApiMock}
        />
      </Route>
    </MemoryRouter>)

  beforeEach(() => {
    configApiMock = new ConfigApiMock()
    hostRules = randomHostRules()
  })

  describe('loader', () => {
    beforeEach(() => {
      configApiMock.getHostRuleMock.mockResolvedValue(hostRules)

      buildHostRulesEdit()
    })

    it('render loader', () => {
      let loader = hostRulesEditWrapper.find(Loader).first()
      expect(loader.prop('label')).toEqual('Host rules loading...')
    })
  })

  describe('list link', () => {
    let listLink = () => hostRulesEditWrapper.find(ButtonLink).first()

    beforeEach(() => {
      configApiMock.getHostRuleMock.mockResolvedValue(hostRules)

      buildHostRulesEdit()

      return waitLoading()
    })

    it('have link to list', () => {
      expect(listLink().prop('to')).toEqual('/host_rules_list')
    })

    it('host link with text', () => {
      expect(listLink().text()).toEqual('List')
    })
  })

  describe('when get host rules error', () => {
    let errorResponse: Response

    beforeEach(() => {
      errorResponse = randomResponse()
      configApiMock.getHostRuleMock.mockRejectedValue(errorResponse)

      buildHostRulesEdit()

      return waitLoading()
    })

    it('render HostRulesEdit', () => {
      expect(hostRulesEdit()).toHaveLength(1)
    })

    it('call fetch called', () => {
      expect(configApiMock.getHostRuleMock).toBeCalled()
    })

    it('not render host rules form', () => {
      expect(hostRulesForm()).toHaveLength(0)
    })

    it('render text error view', () => {
      let errorView = hostRulesEdit().find(ErrorView).first()
      expect(errorView.prop('response')).toEqual(errorResponse)
    })
  })

  describe('when host rules found', () => {
    beforeEach(() => {
      configApiMock.getHostRuleMock.mockResolvedValue(hostRules)

      buildHostRulesEdit()

      return waitLoading()
    })

    it('call fetch called', () => {
      expect(configApiMock.getHostRuleMock).toBeCalled()
    })

    it('render host rules form', () => {
      expect(hostRulesForm().prop('hostRules')).toEqual(hostRules)
    })

    describe('on update host rules', () => {
      let newHostRules: HostRules

      beforeEach(() => {
        newHostRules = randomHostRules()

        let onHostRulesChanged: OnChange = hostRulesForm().prop('onHostRulesChanged')
        onHostRulesChanged(newHostRules)
      })

      it('set host rules on form', () => {
        expect(hostRulesForm().prop('hostRules')).toEqual(newHostRules)
      })

      describe('on success update', () => {
        let successSaveCb: SuccessSaveCb
        let errorSaveCb: ErrorSaveCb

        beforeEach(() => {
          configApiMock.updateHostRulesMock.mockResolvedValue(newHostRules)

          successSaveCb = jest.fn()
          errorSaveCb = jest.fn()

          let onSave: OnSave = hostRulesForm().prop('onSave')
          onSave(successSaveCb, errorSaveCb)
        })

        it('call success callback', () => {
          expect(successSaveCb).toBeCalled()
        })

        it('redirect to new host', () => {
          let history: History = hostRulesEditWrapper
            .children()
            .prop('history')
          expect(history.location.pathname).toEqual(`/host_rules_list/${newHostRules.host}/edit`)
        })
      })
    })

    describe('on save', () => {
      let successSaveCb: SuccessSaveCb
      let errorSaveCb: ErrorSaveCb

      let callSave = () => {
        let onSave: OnSave = hostRulesForm().prop('onSave')
        onSave(successSaveCb, errorSaveCb)
      }

      beforeEach(() => {
        successSaveCb = jest.fn()
        errorSaveCb = jest.fn()
      })

      describe('on error update', () => {
        let errorResponse: Response

        beforeEach(() => {
          errorResponse = new Response(undefined, {
            status: 422,
            statusText: 'Invalid data',
          })
          configApiMock.updateHostRulesMock.mockRejectedValue(errorResponse)

          callSave()
        })

        it('call error callback', () => {
          expect(errorSaveCb).toBeCalledWith(errorResponse)
        })
      })

      describe('on success update', () => {
        beforeEach(() => {
          configApiMock.updateHostRulesMock.mockResolvedValue(hostRules)

          callSave()
        })

        it('call success callback', () => {
          expect(successSaveCb).toBeCalled()
        })

        it('not redirect', () => {
          let history: History = hostRulesEditWrapper
            .children()
            .prop('history')
          expect(history.location.pathname).toEqual(`/host_rules_list/${hostRules.host}/edit`)
        })
      })
    })
  })
})
