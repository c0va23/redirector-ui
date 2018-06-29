import * as React from 'react'
import {
  TableCell,
  TableBody,
  TableRow,
  Button,
} from '@material-ui/core'
import { MemoryRouter, Route } from 'react-router'

import HostRulesView, {
  OnDeleteHostRules,
  HostRulesViewProps,
} from '../../src/components/HostRulesView'
import { HostRules } from 'redirector-client'

import { mount, ReactWrapper } from 'enzyme'
import { randomHostRules } from '../factories/HostRulesFactory'

describe('HostRulesView', () => {
  let hostRules: HostRules
  let onDeleteHostRulesCb: OnDeleteHostRules
  let hostRulesViewWrapper: ReactWrapper
  let hostRulesView: ReactWrapper<HostRulesViewProps, any>

  beforeEach(() => {
    hostRules = randomHostRules()
    onDeleteHostRulesCb = jest.fn()
    hostRulesViewWrapper = mount(<MemoryRouter>
      <Route>
        <HostRulesView
          hostRules={hostRules}
          onDelete={onDeleteHostRulesCb}
        />
      </Route>
    </MemoryRouter>)
    hostRulesView = hostRulesViewWrapper.find(HostRulesView).first()
  })

  describe('render', () => {
    it('have host', () => {
      expect(hostRulesView.text())
        .toEqual(expect.stringContaining(hostRules.host))
    })

    it('have all rules', () => {
      let cells = hostRulesView
        .find(TableBody)
        .find(TableRow)
        .map(row => row.find(TableCell).map(cell => cell.text()))

      let values = hostRules.rules.map(rule => [
        rule.sourcePath,
        rule.target.httpCode.toString(),
        rule.target.path,
        rule.activeFrom && rule.activeFrom.toISOString() || '',
        rule.activeTo && rule.activeTo.toISOString() || '',
      ])

      expect(values).toEqual(cells)
    })
  })

  describe('on delete', () => {
    beforeEach(() => {
      hostRulesView
        .find(Button)
        .filter({ name: 'delete' })
        .first()
        .simulate('click')
    })

    it('call delete callback', () => {
      expect(onDeleteHostRulesCb).toBeCalledWith(hostRules.host)
    })
  })
})
