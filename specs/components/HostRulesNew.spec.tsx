import * as React from 'react'

import HostRulesNew from '../../src/components/HostRulesNew'
import { mount, ReactWrapper } from 'enzyme'
import { HostRules } from 'redirector-client'
import { ConfigApiMock } from '../mocks/ConfigApiMock'
import HostRulesForm, {
  OnChange,
  OnSave,
  SuccessSaveCb,
  ErrorSaveCb,
} from '../../src/components/HostRulesForm'
import { newHostRules, randomHostRules } from '../factories/HostRulesFactory'
import { MemoryRouter } from 'react-router'
import { History } from 'history'
import ButtonLink from '../../src/components/ButtonLink'

describe('HostRulesNew', () => {
  let configApi: ConfigApiMock
  let hostRulesNew: ReactWrapper
  let hostRulesForm: ReactWrapper

  beforeEach(() => {
    configApi = new ConfigApiMock()
    hostRulesNew = mount(<MemoryRouter>
      <HostRulesNew configApi={configApi} />
    </MemoryRouter>)
    hostRulesForm = hostRulesNew.find(HostRulesForm)
  })

  it('render host rules form', () => {
    expect(hostRulesForm.prop('hostRules')).toEqual(newHostRules())
  })

  it('have link to list', () => {
    let listButton = hostRulesNew.find(ButtonLink).first()
    expect(listButton.prop('to')).toEqual('/host_rules_list')
  })

  describe('when hostRules changed', () => {
    let newHostRules: HostRules
    let successSaveCb: SuccessSaveCb
    let errorSaveCb: ErrorSaveCb
    let onSave: OnSave

    const callSave = () =>
      onSave(successSaveCb, errorSaveCb)

    beforeEach(() => {
      newHostRules = randomHostRules()

      let onHostRulesChanged: OnChange = hostRulesForm.prop('onHostRulesChanged')
      onHostRulesChanged(newHostRules)

      successSaveCb = jest.fn()
      errorSaveCb = jest.fn()

      onSave = hostRulesForm.prop('onSave')
    })

    describe('on save success', () => {
      beforeEach(() => {
        configApi.createHostRulesMock.mockResolvedValue(newHostRules)
        callSave()
      })

      it('call success callback', () => {
        expect(successSaveCb).toBeCalled()
      })

      it('redirect to edit page', () => {
        let history = hostRulesNew.children().prop('history') as History
        expect(history.location.pathname).toEqual(`/host_rules_list/${newHostRules.host}/edit`)
      })
    })

    describe('on save error', () => {
      let errorResponse: Response

      beforeEach(() => {
        errorResponse = new Response()

        configApi.createHostRulesMock.mockRejectedValue(errorResponse)
        callSave()
      })

      it('call error callback', () => {
        expect(errorSaveCb).toBeCalledWith(errorResponse)
      })
    })
  })
})
