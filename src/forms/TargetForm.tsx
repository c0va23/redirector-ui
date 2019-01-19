import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import * as React from 'react'
import {
  ModelValidationError,
  Target,
} from 'redirector-client'

import AppContext, { AppContextData } from '../AppContext'
import {
  ChangeStatusCodeEvent,
  StatusCodeSelect,
} from '../components/StatusCodeSelect'
import {
  buildLocalizer,
  findLocaleTranslations,
} from '../utils/localize'
import { fieldValidationErrors } from '../utils/validationErrors'

export type UpdateTarget = (target: Target) => void

export interface TargetFormProps {
  target: Target,
  onUpdateTarget: UpdateTarget,
  modelError: ModelValidationError,
}

export default class TargetForm extends React.Component<TargetFormProps> {
  render () {
    return <AppContext.Consumer>{this.renderWithContext}</AppContext.Consumer>
  }

  private renderWithContext = (appContext: AppContextData) => {
    let localeTranslations = findLocaleTranslations(appContext.errorLocales)
    let localize = buildLocalizer(localeTranslations)
    return (
      <FormGroup>
        <StatusCodeSelect
          name='httpCode'
          label='HTTP Code'
          value={this.props.target.httpCode}
          onChange={this.onNumberChange}
          fullWidth
          required
          error={this.fieldErrors('httpCode').length > 0}
          helperText={this.fieldErrors('httpCode').map(localize).join(', ')}
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
          helperText={this.fieldErrors('path').map(localize).join(', ')}
        />
      </FormGroup>
    )
  }

  private onNumberChange = (event: ChangeStatusCodeEvent) => {
    const name = event.name
    this.props.onUpdateTarget({
      ...this.props.target,
      [name]: event.value,
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
