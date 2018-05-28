import * as React from "react"
import {
  match as Match,
} from "react-router-dom"
import * as MaterialUI from "material-ui"
import * as MaterialUIIcons from "@material-ui/icons"

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
    return <form onSubmit={this.onSubmit}>
      <MaterialUI.TextField
        name="host"
        label="Host"
        value={this.props.hostRules.host}
        onChange={this.onInputChange}
        fullWidth
      />

      <br />

      <h3>Default Target</h3>
      <TargetForm
        target={this.props.hostRules.defaultTarget}
        onUpdateTarget={this.updateTarget}
      />

      <MaterialUI.FormControl fullWidth>
        {this.props.hostRules.rules.map((rule, index) =>
          <RuleForm
            key={index}
            rule={rule}
            onUpdateRule={(rule: Rule) => this.updateRule(index, rule)}
            onRemoveRule={() => this.removeRule(index)}
          />)
        }

        <MaterialUI.Button onClick={() => this.addRule()}>
          Add
        </MaterialUI.Button>
      </MaterialUI.FormControl>

      <br />

      <MaterialUI.Button
        type="submit"
        color="primary"
        variant="raised"
      >
        Save
      </MaterialUI.Button>
    </form>
  }

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      [name]: value,
    })
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.props.onSave()
  }

  private updateTarget = (target: Target) => {
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
      resolver: Rule.ResolverEnum.Simple,
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
