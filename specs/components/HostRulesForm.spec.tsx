import * as React from 'react'

import HostRulesForm from '../../src/components/HostRulesForm'
import TargetForm from '../../src/components/TargetForm'
import RuleForm from '../../src/components/RuleForm'

import { HostRules } from 'redirector-client'

import * as Faker from 'faker'
import * as TargetFactory from '../factories/TargetFactory'
import * as RuleFactory from '../factories/RuleFactory'
import * as HostRulesFactory from '../factories/HostRulesFactory'

import {
  mount,
  ReactWrapper,
} from 'enzyme'

describe('HostRulesForm', () => {
  let hostRules: HostRules

  let hostRulesChangedCb: jest.Mock
  let saveCb: jest.Mock
  let hostRulesForm: ReactWrapper

  beforeEach(() => {
    hostRules = HostRulesFactory.randomHostRules()

    hostRulesChangedCb = jest.fn()
    saveCb = jest.fn()
    hostRulesForm = mount(
      <HostRulesForm
        hostRules={hostRules}
        onHostRulesChanged={hostRulesChangedCb}
        onSave={saveCb}
      />,
    )
  })

  describe('host field', () => {
    let hostField: ReactWrapper

    beforeEach(() => {
      hostField = hostRulesForm.find('TextField[name="host"]').first()
    })

    it('host field have label', () => {
      expect(hostField.prop('label')).toEqual('Host')
    })

    it('host field have value', () => {
      expect(hostField.prop('value')).toEqual(hostRules.host)
    })

    describe('on change', () => {
      let newHost: string

      type OnChangeFn = (event: {
        preventDefault: () => void,
        target: {
          name: string,
          value: string,
        },
      }) => void

      beforeEach(() => {
        newHost = Faker.internet.domainName()

        let onChange: OnChangeFn = hostField.prop('onChange')

        onChange({
          preventDefault: jest.fn(),
          target: {
            value: newHost,
            name: 'host',
          },
        })
      })

      it('update host into hostRules', () => {
        expect(hostRulesChangedCb).toBeCalledWith({
          ...hostRules,
          host: newHost,
        })
      })
    })
  })

  describe('target form', () => {
    let targetForm: ReactWrapper

    type OnUpdateTargetFn = (Target) => void

    beforeEach(() => {
      targetForm = hostRulesForm.find(TargetForm).first()
    })

    it('have value', () => {
      expect(targetForm.prop('target')).toEqual(hostRules.defaultTarget)
    })

    it('update target on TargetForm.onChange', () => {
      let target = TargetFactory.randomTarget()
      let onUpdateTarget: OnUpdateTargetFn = targetForm.prop('onUpdateTarget')
      onUpdateTarget(target)

      expect(hostRulesChangedCb).toBeCalledWith({
        ...hostRules,
        defaultTarget: target,
      })
    })
  })

  describe('add rule', () => {
    let addRuleButton: ReactWrapper

    beforeEach(() => {
      addRuleButton = hostRulesForm
        .find('Button[name="addRule"]')
        .first()
    })

    it('add one rule', () => {
      addRuleButton.simulate('click')

      expect(hostRulesChangedCb).toBeCalledWith({
        ...hostRules,
        rules: hostRules.rules.concat(RuleFactory.newRule()),
      })
    })

    describe('when host rules have two rules', () => {
      beforeEach(() => {
        hostRulesForm.setProps({
          hostRules: {
            ...hostRules,
            rules: [
              RuleFactory.newRule(),
              RuleFactory.newRule(),
            ],
          },
        })
      })

      it('add third rule', () => {
        addRuleButton.simulate('click')

        expect(hostRulesChangedCb).toBeCalledWith({
          ...hostRules,
          rules: [
            RuleFactory.newRule(),
            RuleFactory.newRule(),
            RuleFactory.newRule(),
          ],
        })
      })

      it('update rule', () => {
        let newRule = RuleFactory.randomRule()

        let ruleForm = hostRulesForm.find(RuleForm).at(1)
        let onUpdateRule = ruleForm.prop('onUpdateRule') as (Rule) => void
        onUpdateRule(newRule)

        expect(hostRulesChangedCb).toBeCalledWith({
          ...hostRules,
          rules: [
            RuleFactory.newRule(),
            newRule,
          ],
        })
      })

      it('remove rule', () => {
        let ruleForm = hostRulesForm.find(RuleForm).at(1)
        let onRemoveRule = ruleForm.prop('onRemoveRule') as () => void
        onRemoveRule()

        expect(hostRulesChangedCb).toBeCalledWith({
          ...hostRules,
          rules: [
            RuleFactory.newRule(),
          ],
        })
      })
    })
  })

  describe('click Save button', () => {
    beforeEach(() => {
      hostRulesForm
        .find('Button[type="submit"]')
        .first()
        .simulate('submit')
    })

    it('call save callback', () => {
      expect(saveCb).toBeCalled()
    })

    describe('on success callback', () => {
      let snackbar: ReactWrapper
      beforeEach(() => {
        snackbar = hostRulesForm.find('Snackbar')
        let [ onSuccess, _onError ] = saveCb.mock.calls[0]
        onSuccess()
      })

      it('show success message', () => {
        expect(snackbar.first().text()).toMatch(/Success/)
      })
    })

    describe('on error callback', () => {
      let errorMessage = 'error message'
      let responseBuilder = () => ({
        text: jest.fn().mockResolvedValue(errorMessage),
      })

      beforeEach(() => {
        let [_onSuccess, onError ] = saveCb.mock.calls[0]
        onError(responseBuilder())
      })

      it('show error message', () => {
        expect(hostRulesForm.find('Snackbar').text())
          .toEqual(expect.stringContaining(errorMessage))
      })
    })
  })
})
