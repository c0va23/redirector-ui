import * as React from "react"

import { Target } from "../../gen/api-client"

interface Props {
  target: Target,
  onUpdateTarget: (target: Target) => void,
}

export default class TargetForm extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return <fieldset>
      <label htmlFor="httpCode">
        HTTP code
      </label>
      <input
        name="httpCode"
        value={this.props.target.httpCode}
        onChange={this.onNumberChange.bind(this)}
        type="number"
      />

      <br />

      <label htmlFor="path">
        Path
      </label>
      <input
        name="path"
        value={this.props.target.path}
        onChange={this.onTextChange.bind(this)}
      />
    </fieldset>
  }

  private onNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    const name = event.target.name
    const value = Number.parseFloat(event.target.value)
    this.props.onUpdateTarget({
      ...this.props.target,
      [name]: value,
    })
  }

  private onTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onUpdateTarget({
      ...this.props.target,
      [name]: value,
    })
  }
}
