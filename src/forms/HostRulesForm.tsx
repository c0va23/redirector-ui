import * as React from 'react'

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'

import {
  HostRules,
  ModelValidationError,
  Rule,
  Target,
} from 'redirector-client'

import {
  embedValidationErrors,
  fieldValidationErrors,
} from '../utils/validationErrors'

import RuleForm from './RuleForm'
import TargetForm from './TargetForm'

export type UpdateHostRules = (hostRules: HostRules) => void

export interface HostRulesFormProps {
  hostRules: HostRules,
  onUpdateHostRules: UpdateHostRules,
  modelError: ModelValidationError,
}

export default class HostRulesForm extends React.Component<
  HostRulesFormProps
> {
  render () {
    return (
      <>
        <TextField
          name='host'
          label='Host'
          value={this.props.hostRules.host}
          onChange={this.onInputChange}
          fullWidth
          required
          error={this.fieldErrors('host').length > 0}
          helperText={this.fieldErrors('host').join(', ')}
        />

        <br />

        <h3>Default Target</h3>
        <TargetForm
          target={this.props.hostRules.defaultTarget}
          onUpdateTarget={this.updateTarget}
          modelError={embedValidationErrors(this.props.modelError, 'defaultTarget')}
        />

        <FormControl fullWidth>
          {this.props.hostRules.rules.map(this.renderRuleForm)}

          <Button name='addRule' onClick={this.addRule}>
            Add
          </Button>
        </FormControl>
      </>
    )
  }

  private renderRuleForm = (rule: Rule, index: number) => (
    <RuleForm
      key={index}
      rule={rule}
      ruleIndex={index}
      onUpdateRule={this.updateRule(index)}
      onRemoveRule={this.removeRule(index)}
      modelError={embedValidationErrors(this.props.modelError, 'rules', index)}
    />
  )

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      [name]: value,
    })
  }

  private updateTarget = (target: Target) => {
    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      defaultTarget: target,
    })
  }

  private updateRule = (index: number) => (rule: Rule) => {
    const rules = [
      ...this.props.hostRules.rules.slice(0, index),
      rule,
      ...this.props.hostRules.rules.slice(index + 1),
    ]

    const hostRules: HostRules = {
      ...this.props.hostRules,
      rules,
    }

    this.props.onUpdateHostRules(hostRules)
  }

  private removeRule = (index: number) => () => {
    const newRules = [
      ...this.props.hostRules.rules.slice(0, index),
      ...this.props.hostRules.rules.slice(index + 1),
    ]

    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      rules: newRules,
    })
  }

  private addRule = () => {
    const newRules = this.props.hostRules.rules.concat([{
      sourcePath: '',
      resolver: Rule.ResolverEnum.Simple,
      target: {
        httpCode: 301,
        path: '',
      },
    }])

    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      rules: newRules,
    })
  }

  private fieldErrors = (fieldName: string): Array<string> =>
    fieldValidationErrors(this.props.modelError, fieldName)
      .map(_ => _.translationKey)
}
