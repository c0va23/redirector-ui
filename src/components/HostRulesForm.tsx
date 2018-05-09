import * as React from "react"
import {
  match as Match,
} from "react-router-dom"

import {
  ConfigApi,
  HostRules,
  Target,
  Rule,
} from "../../gen/api-client"

import TargetForm from "./TargetForm"
import RuleForm from "./RuleForm"
import Config from "../Config"


interface Props {
  config: Config,
  hostRules: HostRules,
  onUpdateHostRules: (hostRules: HostRules) => void,
  onSave: () => void,
}

export default class HostRulesForm extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return <form onSubmit={this.onSubmit.bind(this)}>
      <label htmlFor="host">Host</label>
      <input
        name="host"
        value={this.props.hostRules.host}
        onChange={this.onInputChange.bind(this)}
      />

      <br />

      <h3>Default Target</h3>
      <TargetForm
        target={this.props.hostRules.defaultTarget}
        onUpdateTarget={this.updateTarget.bind(this)}
      />

      <fieldset>
        {this.props.hostRules.rules.map((rule, index) =>
          <RuleForm
            key={index}
            rule={rule}
            onUpdateRule={(rule: Rule) => this.updateRule(index, rule)}
            onRemoveRule={() => this.removeRule(index)}
          />)
        }

        <button onClick={() => this.addRule()}>
          Add
        </button>
      </fieldset>

      <button type="submit">
        Save
      </button>
    </form>
  }

  private onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      [name]: value,
    })
  }

  private onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    this.props.onSave()
  }

  private updateTarget(target: Target) {
    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      defaultTarget: target,
    })
  }

  private updateRule(index: number, rule: Rule) {
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

  private removeRule(index: number) {
    const newRules = [
      ...this.props.hostRules.rules.slice(0, index),
      ...this.props.hostRules.rules.slice(index + 1),
    ]

    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      rules: newRules,
    })
  }

  private addRule() {
    const newRules = this.props.hostRules.rules.concat([{
      sourcePath: "",
      target: {
        httpCode: 301,
        path: "",
      }
    }])

    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      rules: newRules,
    })
  }
}
