import * as React from "react"

import { Rule, Target } from "../../gen/api-client"

import TargetForm from "./TargetForm"

interface Props {
  rule: Rule,
  onUpdateRule: (rule: Rule) => void,
  onRemoveRule: () => void,
}

export default class RuleForm extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props)
    this.state = Object.assign({}, props.rule)
  }

  render() {
    return <fieldset>
      <label htmlFor="sourcePath">Source path:</label>
      <input
        name="sourcePath"
        value={this.props.rule.sourcePath}
        onChange={this.onInputChange.bind(this)}
      />

      <br />

      <label htmlFor="activeFrom">Active from:</label>
      <input
        name="activeFrom"
        value={this.formatDate(this.props.rule.activeFrom)}
        onChange={this.onDateTimeChange.bind(this)}
        type="datetime-local"
      />

      <br />

      <label htmlFor="activeTo">Active to:</label>
      <input
        name="activeFrom"
        value={this.formatDate(this.props.rule.activeTo)}
        onChange={this.onDateTimeChange.bind(this)}
        type="datetime-local"
      />

      <TargetForm
        target={this.props.rule.target}
        onUpdateTarget={this.updateTarget.bind(this)}
      />

      <button onClick={this.props.onRemoveRule.bind(this)}>
        Remove
      </button>
    </fieldset>
  }

  private onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onUpdateRule({
      ...this.props.rule,
      [name]: value,
    })
  }

  private onDateTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    const dateTime = "" != value ? new Date(value) : null
    this.props.onUpdateRule({
      ...this.props.rule,
      [name]: dateTime,
    })
  }

  private formatDate(date?: Date): string | undefined {
    if(!date) return
    return date.toJSON()
  }

  private updateTarget(target: Target) {
    this.props.onUpdateRule({
      ...this.props.rule,
      target,
    })
  }
}
