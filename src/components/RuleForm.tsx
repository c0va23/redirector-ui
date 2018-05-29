import * as React from "react"
import * as moment from "moment"
import * as MaterialUI from "@material-ui/core"
import * as Styles from "@material-ui/core/styles"

import { Rule, Target } from "../../gen/api-client"

import TargetForm from "./TargetForm"

interface Props {
  rule: Rule,
  ruleIndex: Number,
  onUpdateRule: (rule: Rule) => void,
  onRemoveRule: () => void,
}

const downCaseCharRegex = /[a-z]/

const styles: Styles.StyleRulesCallback = (theme: MaterialUI.Theme): Styles.StyleRules => {
  return {
    selectControl: {
      marginTop: theme.spacing.unit * 2,
    },
    selectInput: {
      marginTop: theme.spacing.unit,
    },
  }
}

class RuleForm extends React.Component<Props & Styles.WithStyles, {}> {
  render() {
    return <MaterialUI.FormGroup>
      <h3>Rule</h3>

      <MaterialUI.TextField
        name="sourcePath"
        label="Source path"
        value={this.props.rule.sourcePath}
        onChange={this.onInputChange}
        fullWidth
      />

      <MaterialUI.FormControl className={this.props.classes.selectControl}>
        <MaterialUI.InputLabel
          htmlFor={`rule-resolver-${this.props.ruleIndex}`}
        >Resolver</MaterialUI.InputLabel>

        <MaterialUI.Select
          name="resolver"
          value={this.props.rule.resolver}
          onChange={this.onSelectChange}
          inputProps={{
            id: `rule-resolver-${this.props.ruleIndex}`
          }}
          className={this.props.classes.selectInput}
        >
          {this.resolverItems()}
        </MaterialUI.Select>
      </MaterialUI.FormControl>

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

export default MaterialUI.withStyles(styles)(RuleForm)
