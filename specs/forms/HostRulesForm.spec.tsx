import * as React from 'react'

import {
  Button,
  TextField,
} from '@material-ui/core'

import {
  mount,
} from 'enzyme'
import * as Faker from 'faker'

import {
  HostRules,
  ModelValidationError,
  Rule,
} from 'redirector-client'

import HostRulesForm from '../../src/forms/HostRulesForm'
import RuleForm from '../../src/forms/RuleForm'
import TargetForm from '../../src/forms/TargetForm'

import * as HostRulesFactory from '../factories/HostRulesFactory'
import * as RuleFactory from '../factories/RuleFactory'
import * as TargetFactory from '../factories/TargetFactory'

import { embedValidationErrors } from '../../src/utils/validationErrors'

describe('HostRulesForm', () => {
  let hostRules: HostRules
  let modelError: ModelValidationError

  let updateCb: jest.Mock

  let hostRulesForm = () =>
    mount(
      <HostRulesForm
        hostRules={hostRules}
        onUpdateHostRules={updateCb}
        modelError={modelError}
      />,
    )

  beforeEach(() => {
    hostRules = HostRulesFactory.randomHostRules()
    modelError = []

    updateCb = jest.fn()
  })

  describe('host field', () => {
    const fieldName = 'host'

    let hostField = () =>
      hostRulesForm()
        .find(TextField)
        .filter({ name: fieldName })
        .first()

    it('host field have label', () => {
      expect(hostField().prop('label')).toEqual('Host')
    })

    it('host field have value', () => {
      expect(hostField().prop('value')).toEqual(hostRules.host)
    })

    it('not have error', () => {
      expect(hostField().prop('error')).toEqual(false)
    })

    it('not have helper text', () => {
      expect(hostField().prop('helperText')).toEqual('')
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

        let onChange: OnChangeFn = hostField().prop('onChange')

        onChange({
          preventDefault: jest.fn(),
          target: {
            value: newHost,
            name: fieldName,
          },
        })
      })

      it('update host into hostRules', () => {
        expect(updateCb).toBeCalledWith({
          ...hostRules,
          host: newHost,
        })
      })
    })

    describe('with errors', () => {
      beforeEach(() => {
        modelError = [
          {
            name: fieldName,
            errors: [
              { translationKey: 'error1' },
              { translationKey: 'error2' },
            ],
          },
        ]
      })

      it('have error', () => {
        expect(hostField().prop('error')).toEqual(true)
      })

      it('have helper text', () => {
        expect(hostField().prop('helperText')).toEqual('error1, error2')
      })
    })
  })

  describe('target form', () => {
    let targetForm = () => hostRulesForm().find(TargetForm).first()

    it('have value', () => {
      expect(targetForm().prop('target')).toEqual(hostRules.defaultTarget)
    })

    it('update target on TargetForm.onChange', () => {
      let target = TargetFactory.randomTarget()
      targetForm().prop('onUpdateTarget')(target)

      expect(updateCb).toBeCalledWith({
        ...hostRules,
        defaultTarget: target,
      })
    })

    it('have empty model error', () => {
      expect(targetForm().prop('modelError')).toEqual([])
    })

    describe('have errors', () => {
      beforeEach(() => {
        modelError = [
          {
            name: 'defaultTarget.field',
            errors: [
              { translationKey: 'error1' },
              { translationKey: 'error2' },
            ],
          },
        ]
      })

      it('have model errors', () => {
        expect(targetForm().prop('modelError'))
          .toEqual(embedValidationErrors(modelError, 'defaultTarget'))
      })
    })
  })

  describe('add rule', () => {
    let addRuleButton = () =>
       hostRulesForm()
        .find(Button)
        .filter({ name : 'addRule' })
        .first()

    it('add one rule', () => {
      addRuleButton().simulate('click')

      expect(updateCb).toBeCalledWith({
        ...hostRules,
        rules: hostRules.rules.concat(RuleFactory.newRule()),
      })
    })

    describe('when host rules have two rules', () => {
      beforeEach(() => {
        hostRules = {
          ...hostRules,
          rules: [
            RuleFactory.randomRule(),
            RuleFactory.randomRule(),
          ],
        }
      })

      it('add third rule', () => {
        addRuleButton().simulate('click')

        expect(updateCb).toBeCalledWith({
          ...hostRules,
          rules: hostRules.rules.concat(RuleFactory.newRule()),
        })
      })

      describe('when rule have error', () => {
        const ruleIndex = 1
        const ruleForm = () => hostRulesForm().find(RuleForm).at(ruleIndex)

        beforeEach(() => {
          modelError = [
            {
              name: `rules.${ruleIndex}.field`,
              errors: [
                { translationKey: 'error1' },
                { translationKey: 'error1' },
              ],
            },
          ]
        })

        it('render rule form with error', () => {
          expect(ruleForm().prop('modelError')).toEqual([
            {
              name: 'field',
              errors: modelError[0].errors,
            },
          ])
        })
      })

      describe('on update rule', () => {
        let newRule: Rule

        beforeEach(() => {
          newRule = RuleFactory.randomRule()

          hostRulesForm()
            .find(RuleForm).at(1)
            .prop('onUpdateRule')(newRule)
        })

        it('update rule', () => {
          expect(updateCb).toBeCalledWith({
            ...hostRules,
            rules: [
              hostRules.rules[0],
              newRule,
            ],
          })
        })
      })

      describe('on remove rule', () => {
        beforeEach(() => {
          hostRulesForm()
            .find(RuleForm)
            .at(1)
            .prop('onRemoveRule')()
        })

        it('remove rule', () => {
          expect(updateCb).toBeCalledWith({
            ...hostRules,
            rules: [hostRules.rules[0]],
          })
        })
      })
    })
  })
})
