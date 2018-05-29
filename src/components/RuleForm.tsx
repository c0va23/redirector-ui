import * as React from "react"
import * as moment from "moment"
import * as MaterialUI from "@material-ui/core"

import { Rule, Target } from "../../gen/api-client"

import TargetForm from "./TargetForm"

interface Props {
  rule: Rule,
  onUpdateRule: (rule: Rule) => void,
  onRemoveRule: () => void,
}

const downCaseCharRegex = /[a-z]/

export default class RuleForm extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return <MaterialUI.FormGroup>
      <h3>Role</h3>

      <MaterialUI.TextField
        name="sourcePath"
        label="Source path"
        value={this.props.rule.sourcePath}
        onChange={this.onInputChange}
        fullWidth
      />

      <br />

      <MaterialUI.TextField
        name="activeFrom"
        label="Active from"
        value={this.formatDate(this.props.rule.activeFrom)}
        onChange={this.onDateTimeChange}
        type="datetime-local"
        fullWidth
        InputLabelProps={{shrink: true}}
      />

      <br />

      <MaterialUI.TextField
        name="activeTo"
        label="Active to"
        value={this.formatDate(this.props.rule.activeTo)}
        onChange={this.onDateTimeChange}
        type="datetime-local"
        fullWidth
        InputLabelProps={{shrink: true}}
      />

      <MaterialUI.FormControl>
        <MaterialUI.InputLabel>Resolver</MaterialUI.InputLabel>

        <MaterialUI.Select
          name="resolver"
          value={this.props.rule.resolver}
          onChange={this.onSelectChange}
          inputProps={{
            id: "rule-resolver"
          }}
        >
          {this.resolverItems()}
        </MaterialUI.Select>
      </MaterialUI.FormControl>

      <h3>Target</h3>

      <TargetForm
        target={this.props.rule.target}
        onUpdateTarget={this.updateTarget}
      />

      <MaterialUI.Button onClick={this.props.onRemoveRule}>
        Remove
      </MaterialUI.Button>
    </MaterialUI.FormGroup>
  }

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onUpdateRule({
      ...this.props.rule,
      [name]: value,
    })
  }

  private onDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    const dateTime = "" != value ? new Date(value) : null
    this.props.onUpdateRule({
      ...this.props.rule,
      [name]: dateTime,
    })
  }

  private onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onUpdateRule({
      ...this.props.rule,
      [name]: value,
    })
  }

  private formatDate(date?: Date): string {
    if(!date) return ''
    return moment(date).format("YYYY-MM-DDTHH:mm")
  }

  private updateTarget = (target: Target) =>
    this.props.onUpdateRule({
      ...this.props.rule,
      target,
    })

  private resolverItems = () =>
    Object.keys(Rule.ResolverEnum)
      .filter((resolver: string) => downCaseCharRegex.test(resolver[0]))
      .map((resolver) =>
        <MaterialUI.MenuItem
          key={resolver}
          value={resolver}
        >{Rule.ResolverEnum[resolver as any]}</MaterialUI.MenuItem>
      )
}
