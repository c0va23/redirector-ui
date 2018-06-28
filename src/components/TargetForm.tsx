import * as React from 'react'
import * as MaterialUI from '@material-ui/core'

import { Target } from 'redirector-client'

export type OnUpdateTarget = (target: Target) => void

export interface TargetFormProps {
  target: Target,
  onUpdateTarget: OnUpdateTarget,
}

export default class TargetForm extends React.Component<TargetFormProps> {
  render () {
    return <MaterialUI.FormGroup>
      <MaterialUI.TextField
        name='httpCode'
        label='HTTP Code'
        value={this.props.target.httpCode}
        onChange={this.onNumberChange.bind(this)}
        type='number'
        fullWidth
      />

      <br />

      <MaterialUI.TextField
        name='path'
        label='Path'
        value={this.props.target.path}
        onChange={this.onTextChange.bind(this)}
        fullWidth
      />
    </MaterialUI.FormGroup>
  }

  private onNumberChange (event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    const name = event.target.name
    const value = Number.parseFloat(event.target.value)
    this.props.onUpdateTarget({
      ...this.props.target,
      [name]: value,
    })
  }

  private onTextChange (event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onUpdateTarget({
      ...this.props.target,
      [name]: value,
    })
  }
}
