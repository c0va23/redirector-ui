import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import * as React from 'react'

import { HTTP_STATUS_CODES } from '../utils/httpStatusCodes'

export interface ChangeStatusCodeEvent {
  name: string,
  value: number,
}

interface StatusCodeProps {
  value: number
  onChange: (event: ChangeStatusCodeEvent) => void
  label: string
  name: string
  helperText?: string
  error?: boolean
  required?: boolean
  fullWidth?: boolean
}

export class StatusCodeSelect extends React.Component<StatusCodeProps> {
  render () {
    return (
      <FormControl>
        <InputLabel>{this.props.label}</InputLabel>
        <Select
          value={this.props.value}
          name={this.props.name}
          onChange={this.mapOnChange}
          fullWidth={this.props.fullWidth}
        >
          {this.menuItems}
        </Select>
        {this.formHelperText()}
      </FormControl>
    )
  }

  private mapOnChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    this.props.onChange({
      name: this.props.name,
      value: parseInt(event.target.value, 10),
    })

  private menuItems =
    HTTP_STATUS_CODES.map(({ code, message }) => (
      <MenuItem
        value={code}
        key={code}
      >
        {code} — {message}
      </MenuItem>
    ))

  private formHelperText () {
    if (undefined === this.props.helperText) return

    return (
      <FormHelperText
        error={this.props.error}
        required={this.props.required}
      >
        {this.props.helperText}
      </FormHelperText>
    )
  }
}
