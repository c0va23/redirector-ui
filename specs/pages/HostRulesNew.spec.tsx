import {
  ReactWrapper,
  mount,
} from 'enzyme'
import { History } from 'history'
import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { HostRules } from 'redirector-client'

import ButtonLink from '../../src/components/ButtonLink'
import HostRulesFormWrapper, {
  ErrorSaveCb,
  HostRulesFormWrapperProps,
  SaveHostRules,
  SuccessSaveCb,
} from '../../src/forms/HostRulesFormWrapper'
import HostRulesNew from '../../src/pages/HostRulesNew'
import {
  newHostRules,
  randomHostRules,
} from '../factories/HostRulesFactory'
import { ConfigApiMock } from '../mocks/ConfigApiMock'

describe('HostRulesNew', () => {
  let configApi: ConfigApiMock
  let hostRulesNew: ReactWrapper
  let hostRulesForm: ReactWrapper<HostRulesFormWrapperProps>

  beforeEach(() => {
    configApi = new ConfigApiMock()
    hostRulesNew = mount(
      <MemoryRouter>
        <HostRulesNew configApi={configApi} />
      </MemoryRouter>,
    )
    hostRulesForm = hostRulesNew.find(HostRulesFormWrapper)
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
    let onSave: SaveHostRules

    const callSave = () =>
      onSave(successSaveCb, errorSaveCb)

    beforeEach(() => {
      newHostRules = randomHostRules()

      hostRulesForm
        .props()
        .onUpdateHostRules(newHostRules)

      successSaveCb = jest.fn()
      errorSaveCb = jest.fn()

      onSave = hostRulesForm.prop('onSaveHostRules')
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
