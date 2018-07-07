import * as React from 'react'

import {
  Button,
  IconButton,
  Snackbar,
  TextField,
} from '@material-ui/core'

import {
  ReactWrapper,
  mount,
} from 'enzyme'
import * as Faker from 'faker'

import { HostRules } from 'redirector-client'

import HostRulesForm, {
  HostRulesFormProps,
} from '../../src/forms/HostRulesForm'
import RuleForm, {
  UpdateRule,
} from '../../src/forms/RuleForm'
import TargetForm, {
  TargetFormProps,
  UpdateTarget,
} from '../../src/forms/TargetForm'

import * as HostRulesFactory from '../factories/HostRulesFactory'
import * as RuleFactory from '../factories/RuleFactory'
import * as TargetFactory from '../factories/TargetFactory'

describe('HostRulesForm', () => {
  let hostRules: HostRules

  let hostRulesChangedCb: jest.Mock
  let saveCb: jest.Mock
  let hostRulesForm: ReactWrapper<HostRulesFormProps>

  beforeEach(() => {
    hostRules = HostRulesFactory.randomHostRules()

    hostRulesChangedCb = jest.fn()
    saveCb = jest.fn()
    hostRulesForm = mount(
      <HostRulesForm
        hostRules={hostRules}
        onUpdateHostRules={hostRulesChangedCb}
        onSave={saveCb}
      />,
    )
  })

  describe('host field', () => {
    let hostField: ReactWrapper

    beforeEach(() => {
      hostField = hostRulesForm
        .find(TextField)
        .filter({ name: 'host' })
        .first()
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
    let targetForm: ReactWrapper<TargetFormProps, any>

    beforeEach(() => {
      targetForm = hostRulesForm.find(TargetForm).first()
    })

    it('have value', () => {
      expect(targetForm.prop('target')).toEqual(hostRules.defaultTarget)
    })

    it('update target on TargetForm.onChange', () => {
      let target = TargetFactory.randomTarget()
      let onUpdateTarget: UpdateTarget = targetForm.prop('onUpdateTarget')
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
        .find(Button)
        .filter({ name : 'addRule' })
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
        let onUpdateRule: UpdateRule = ruleForm.prop('onUpdateRule')
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
        .find(Button)
        .filter({ type: 'submit' })
        .first()
        .simulate('submit')
    })

    it('call save callback', () => {
      expect(saveCb).toBeCalled()
    })

    describe('on success callback', () => {
      let snackbar: ReactWrapper
      beforeEach(() => {
        let [ onSuccess ] = saveCb.mock.calls[0]
        onSuccess()
        snackbar = hostRulesForm.update().find(Snackbar).first()
      })

      it('show success message', () => {
        expect(snackbar.first().text()).toMatch(/Success/)
      })

      it('open snackbar', () => {
        expect(snackbar.prop('open')).toBeTruthy()
      })
    })

    describe('on error callback', () => {
      let errorMessage = 'error message'
      let snackbar: ReactWrapper

      beforeEach(() => {
        let [ , onError ] = saveCb.mock.calls[0]
        let response = { text: jest.fn().mockResolvedValue(errorMessage) }
        onError(response)

        return response.text().then(() => {
          snackbar = hostRulesForm
            .update()
            .find(Snackbar)
            .first()
        })
      })

      it('show error message', () => {
        expect(snackbar.text()).toEqual(expect.stringContaining(errorMessage))
      })

      it('open snackbar', () => {
        expect(snackbar.prop('open')).toBeTruthy()
      })

      describe('close snackbar', () => {
        beforeEach(() => {
          snackbar
            .find(IconButton)
            .first()
            .simulate('click')
          snackbar = hostRulesForm
            .find(Snackbar)
            .first()
        })

        it('close snackbar', () => {
          expect(snackbar.prop('open')).toBeFalsy()
        })
      })
    })
  })
})
