import * as React from 'react'

import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'

import {
  ModelValidationError,
  Target,
} from 'redirector-client'

import { fieldValidationErrors } from '../utils/validationErrors'

export type UpdateTarget = (target: Target) => void

export interface TargetFormProps {
  target: Target,
  onUpdateTarget: UpdateTarget,
  modelError: ModelValidationError,
}

export default class TargetForm extends React.Component<TargetFormProps> {
  render () {
    return (
      <FormGroup>
        <TextField
          name='httpCode'
          label='HTTP Code'
          value={this.props.target.httpCode}
          onChange={this.onNumberChange}
          type='number'
          fullWidth
          required
          error={this.fieldErrors('httpCode').length > 0}
          helperText={this.fieldErrors('httpCode').join(', ')}
        />

        <br />

        <TextField
          name='path'
          label='Path'
          value={this.props.target.path}
          onChange={this.onTextChange}
          fullWidth
          required
          error={this.fieldErrors('path').length > 0}
          helperText={this.fieldErrors('path').join(', ')}
        />
      </FormGroup>
    )
  }

  private onNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = Number.parseFloat(event.target.value)
    this.props.onUpdateTarget({
      ...this.props.target,
      [name]: value,
    })
  }

  private onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onUpdateTarget({
      ...this.props.target,
      [name]: value,
    })
  }
  private fieldErrors = (fieldName: string): Array<string> =>
    fieldValidationErrors(this.props.modelError, fieldName)
      .map(_ => _.translationKey)
}
