import * as React from 'react'

import {
  Button,
  InputLabel,
  Select,
  TextField,
} from '@material-ui/core'
import { InputProps } from '@material-ui/core/Input'
import * as moment from 'moment'

import {
  ReactWrapper,
  mount,
} from 'enzyme'

import {
  Rule,
  Target,
} from 'redirector-client'

import RuleForm from '../../src/components/RuleForm'
import TargetForm, {
  OnUpdateTarget,
  TargetFormProps,
} from '../../src/components/TargetForm'

import { randomDate } from '../factories/DateFactory'
import { randomPath } from '../factories/PathFactory'
import {
  randomResolver,
  randomRule,
} from '../factories/RuleFactory'

const formatInputDateTimeLocale = (dateTime: Date): string =>
  moment(dateTime).format('YYYY-MM-DDTHH:mm')

describe('RuleForm', () => {
  let rule: Rule
  let ruleIndex: number
  let updateRuleCb: (rule: Rule) => void
  let removeRuleCb: () => void
  let ruleForm: ReactWrapper

  const fireChangeInput = (field: ReactWrapper, name: string, value: string) =>
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
    ruleForm = mount(<RuleForm
      rule={rule}
      ruleIndex={ruleIndex}
      onUpdateRule={updateRuleCb}
      onRemoveRule={removeRuleCb}
    />)
  })

  describe('field sourcePath', () => {
    let sourcePathField: ReactWrapper
    const fieldName = 'sourcePath'

    beforeEach(() => {
      sourcePathField = ruleForm.find(TextField).filter({ name: fieldName })
    })

    it('have label', () => {
      expect(sourcePathField.prop('label')).toEqual('Source path')
    })

    it('have value', () => {
      expect(sourcePathField.prop('value')).toEqual(rule.sourcePath)
    })

    describe('update event', () => {
      let newSourcePath: string

      beforeEach(() => {
        newSourcePath = randomPath()
        fireChangeInput(sourcePathField, fieldName, newSourcePath)
      })

      it('call update rule callback', () => {
        expect(updateRuleCb).toBeCalledWith({
          ...rule,
          sourcePath: newSourcePath,
        })
      })
    })
  })

  const describeNullableDate = (fieldName: 'activeTo' | 'activeFrom', label: string) => {
    describe(`field ${fieldName}`, () => {
      let field: ReactWrapper

      beforeEach(() => {
        field = ruleForm.find(TextField).filter({ name: fieldName }).first()
      })

      it('have label', () => {
        expect(field.prop('label')).toEqual(label)
      })

      it('have value', () => {
        let formattedValue = formatInputDateTimeLocale(rule[fieldName] as Date)
        expect(field.prop('value')).toEqual(formattedValue)
      })

      describe('update event', () => {
        let newDate: Date

        beforeEach(() => {
          newDate = randomDate()
          fireChangeInput(field, fieldName, formatInputDateTimeLocale(newDate))
        })

        it('call update rule callback', () => {
          expect(updateRuleCb).toBeCalledWith({
            ...rule,
            [fieldName]: newDate,
          })
        })
      })

      describe('when active from null', () => {
        beforeEach(() => {
          ruleForm.setProps({
            rule: {
              ...rule,
              [fieldName]: null,
            },
          })
          field = ruleForm.find(TextField).filter({ name: fieldName })
        })

        it('have empty string value', () => {
          expect(field.prop('value')).toEqual('')
        })
      })

      describe('change to empty string', () => {
        beforeEach(() => fireChangeInput(field, fieldName, ''))

        it('call update rule callback with null activeTo', () => {
          expect(updateRuleCb).toBeCalledWith({
            ...rule,
            [fieldName]: null,
          })
        })
      })
    })
  }

  describeNullableDate('activeFrom', 'Active from')
  describeNullableDate('activeTo', 'Active to')

  describe('resolver selector', () => {
    let resolverSelect: ReactWrapper
    const fieldName = 'resolver'

    beforeEach(() => {
      resolverSelect = ruleForm.find(Select).filter({ name: fieldName })
    })

    it('have value', () => {
      expect(resolverSelect.prop('value')).toEqual(rule.resolver)
    })

    it('have label', () => {
      let inputProps: InputProps = resolverSelect.prop('inputProps')
      let inputLabel = ruleForm.find(InputLabel).filter({
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
        let onChange: OnChange = resolverSelect.prop('onChange')

        onChange({
          preventDefault: jest.fn(),
          target: {
            name: fieldName,
            value: newResolver,
          },
        })
      })

      it('call update rule callback', () => {
        expect(updateRuleCb).toBeCalledWith({
          ...rule,
          resolver: newResolver,
        })
      })
    })
  })

  describe('target fields', () => {
    let targetForm: ReactWrapper<TargetFormProps, any>

    beforeEach(() => targetForm = ruleForm.find(TargetForm).first())

    it('have value', () => {
      expect(targetForm.prop('target')).toEqual(rule.target)
    })

    describe('on update target', () => {
      let newTarget: Target

      beforeEach(() => {
        let onUpdateTarget: OnUpdateTarget = targetForm.prop('onUpdateTarget')
        onUpdateTarget(newTarget)
      })

      it('call update rule callback', () => {
        expect(updateRuleCb).toBeCalledWith({
          ...rule,
          target: newTarget,
        })
      })
    })
  })

  describe('Remove button', () => {
    let removeButton: ReactWrapper

    beforeEach(() => removeButton = ruleForm.find(Button))

    it('have text', () => {
      expect(removeButton.text()).toEqual('Remove')
    })

    describe('on click', () => {
      beforeEach(() => { removeButton.simulate('click') })

      it('call remove rule callback', () => {
        expect(removeRuleCb).toBeCalled()
      })
    })
  })
})
