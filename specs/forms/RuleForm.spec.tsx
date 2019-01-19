import {
  Button,
  InputLabel,
  Select,
  TextField,
} from '@material-ui/core'
import { InputProps } from '@material-ui/core/Input'
import {
  ReactWrapper,
  mount,
} from 'enzyme'
import * as React from 'react'
import {
  ModelValidationError,
  Rule,
  Target,
} from 'redirector-client'

import RuleForm, {
 RemoveRule,
  UpdateRule,
} from '../../src/forms/RuleForm'
import TargetForm from '../../src/forms/TargetForm'
import formatInputTime from '../../src/utils/formatInputTime'
import { randomDate } from '../factories/DateFactory'
import { randomPath } from '../factories/PathFactory'
import {
  randomResolver,
  randomRule,
} from '../factories/RuleFactory'
import { randomTarget } from '../factories/TargetFactory'

describe('RuleForm', () => {
  let rule: Rule
  let ruleIndex: number
  let updateRuleCb: UpdateRule
  let removeRuleCb: RemoveRule
  let modelError: ModelValidationError
  const ruleForm = () => mount(
      <RuleForm
        rule={rule}
        ruleIndex={ruleIndex}
        onUpdateRule={updateRuleCb}
        onRemoveRule={removeRuleCb}
        modelError={modelError}
      />,
    )

  const fieldErrors = (fieldName: string) => [{
    name: fieldName,
    errors: [
      { translationKey: 'error1' },
      { translationKey: 'error2' },
    ],
  }]

  const fieldErrorMessage = 'error1, error2'

  const fireChangeInput = (
    field: ReactWrapper,
    name: keyof Rule,
    value: string,
  ) =>
    field
      .find('input')
      .simulate('change', {
        target: {
          name: name,
          value: value,
        },
      })

  beforeEach(() => {
    rule = randomRule()
    ruleIndex = Math.round(Math.random() * 10)
    updateRuleCb = jest.fn()
    removeRuleCb = jest.fn()
    modelError = []
  })

  describe('field sourcePath', () => {
    const fieldName = 'sourcePath'
    let sourcePathField = () =>
      ruleForm().find(TextField).filter({ name: fieldName }).first()

    it('have label', () => {
      expect(sourcePathField().prop('label')).toEqual('Source path')
    })

    it('have value', () => {
      expect(sourcePathField().prop('value')).toEqual(rule.sourcePath)
    })

    it('not have error', () => {
      expect(sourcePathField().prop('error')).toBeFalsy()
      expect(sourcePathField().prop('helperText')).toEqual('')
    })

    describe('update event', () => {
      let newSourcePath: string

      beforeEach(() => {
        newSourcePath = randomPath()
        fireChangeInput(sourcePathField(), fieldName, newSourcePath)
      })

      it('call update rule callback', () => {
        expect(updateRuleCb).toBeCalledWith({
          ...rule,
          sourcePath: newSourcePath,
        })
      })
    })

    describe('with errors', () => {
      beforeEach(() => modelError = fieldErrors(fieldName))

      it('have error', () => {
        expect(sourcePathField().prop('error')).toBeTruthy()
        expect(sourcePathField().prop('helperText')).toEqual(fieldErrorMessage)
      })
    })
  })

  const describeNullableDate = (fieldName: 'activeTo' | 'activeFrom', label: string) => {
    describe(`field ${fieldName}`, () => {
      let field = () =>
        ruleForm().find(TextField).filter({ name: fieldName }).first()

      it('have label', () => {
        expect(field().prop('label')).toEqual(label)
      })

      it('have value', () => {
        let formattedValue = formatInputTime(rule[fieldName] as Date)
        expect(field().prop('value')).toEqual(formattedValue)
      })

      it('not have error', () => {
        expect(field().prop('error')).toBeFalsy()
        expect(field().prop('helperText')).toEqual('')
      })

      describe('update event', () => {
        let newDate: Date

        beforeEach(() => {
          newDate = randomDate()
          fireChangeInput(field(), fieldName, formatInputTime(newDate))
        })

        it('call update rule callback', () => {
          expect(updateRuleCb).toBeCalledWith({
            ...rule,
            [fieldName]: newDate,
          })
        })
      })

      describe('when active from null', () => {
        beforeEach(() => rule = { ...rule, [fieldName]: null })

        it('have empty string value', () => {
          expect(field().prop('value')).toEqual('')
        })
      })

      describe('change to empty string', () => {
        beforeEach(() => fireChangeInput(field(), fieldName, ''))

        it('call update rule callback with null activeTo', () => {
          expect(updateRuleCb).toBeCalledWith({ ...rule, [fieldName]: null })
        })
      })

      describe('with error', () => {
        beforeEach(() => modelError = fieldErrors(fieldName))

        it('have error', () => {
          expect(field().prop('error')).toBeTruthy()
          expect(field().prop('helperText')).toEqual(fieldErrorMessage)
        })
      })
    })
  }

  describeNullableDate('activeFrom', 'Active from')
  describeNullableDate('activeTo', 'Active to')

  describe('resolver selector', () => {
    const fieldName = 'resolver'
    let resolverSelect = () =>
      ruleForm().find(Select).filter({ name: fieldName }).first()

    it('have value', () => {
      expect(resolverSelect().prop('value')).toEqual(rule.resolver)
    })

    it('have label', () => {
      let inputProps: InputProps = resolverSelect().prop('inputProps')
      let inputLabel = ruleForm().find(InputLabel).filter({
        htmlFor: inputProps['id'],
      })
      expect(inputLabel.text()).toEqual(expect.stringContaining('Resolver'))
    })

    describe('on change', () => {
      let newResolver: Rule.ResolverEnum

      type OnChange = (event: {
        preventDefault: () => void,
        target: {
          name: string,
          value: Rule.ResolverEnum,
        },
      }) => void

      beforeEach(() => {
        newResolver = randomResolver()

        let onChange: OnChange = resolverSelect().prop('onChange')

        onChange({
          preventDefault: jest.fn(),
          target: {
            name: fieldName,
            value: newResolver,
          },
        })
      })

      it('call update rule callback', () => {
        expect(updateRuleCb).toBeCalledWith({ ...rule, resolver: newResolver })
      })
    })
  })

  describe('target fields', () => {
    let targetForm = () => ruleForm().find(TargetForm).first()

    it('have value', () => {
      expect(targetForm().prop('target')).toEqual(rule.target)
    })

    it('have empty model errors', () => {
      expect(targetForm().prop('modelError')).toEqual([])
    })

    describe('on update target', () => {
      let newTarget: Target

      beforeEach(() => {
        newTarget = randomTarget()
        targetForm().prop('onUpdateTarget')(newTarget)
      })

      it('call update rule callback', () => {
        expect(updateRuleCb).toBeCalledWith({
          ...rule,
          target: newTarget,
        })
      })
    })

    describe('with errors', () => {
      beforeEach(() => modelError = fieldErrors('target.httpCode'))

      it('have model error', () => {
        expect(targetForm().prop('modelError')).toEqual(fieldErrors('httpCode'))
      })
    })
  })

  describe('Remove button', () => {
    const removeButton = () => ruleForm().find(Button).first()

    it('have text', () => {
      expect(removeButton().text()).toEqual('Remove')
    })

    describe('on click', () => {
      beforeEach(() => removeButton().simulate('click'))

      it('call remove rule callback', () => {
        expect(removeRuleCb).toBeCalled()
      })
    })
  })
})
