import * as React from 'react'

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'

import { Rule, Target } from 'redirector-client'

import formatInputTime from '../utils/formatInputTime'

import TargetForm from './TargetForm'

export type UpdateRule = (rule: Rule) => void
export type RemoveRule = () => void

interface Props {
  rule: Rule,
  ruleIndex: Number,
  onUpdateRule: UpdateRule,
  onRemoveRule: RemoveRule,
}

const downCaseCharRegex = /[a-z]/

const styles: StyleRulesCallback = (theme) => ({
  formControl: {
    marginTop: theme.spacing.unit * 2,
  },
  selectInput: {
    marginTop: theme.spacing.unit,
  },
})

class RuleForm extends React.Component<Props & WithStyles> {
  render () {
    let classes = this.props.classes

    return <FormGroup>
      <h3>Rule</h3>

      <TextField
        name='sourcePath'
        label='Source path'
        value={this.props.rule.sourcePath}
        onChange={this.onInputChange}
        className={classes.formControl}
        required
      />

      <FormControl
        className={classes.formControl}
        required
      >
        <InputLabel
          htmlFor={`rule-resolver-${this.props.ruleIndex}`}
        >Resolver</InputLabel>

        <Select
          name='resolver'
          value={this.props.rule.resolver}
          onChange={this.onSelectChange}
          inputProps={{
            id: `rule-resolver-${this.props.ruleIndex}`,
          }}
          className={this.props.classes.selectInput}
        >
          {this.resolverItems()}
        </Select>
      </FormControl>

      <TextField
        name='activeFrom'
        label='Active from'
        value={this.formatDate(this.props.rule.activeFrom)}
        onChange={this.onDateTimeChange}
        type='datetime-local'
        fullWidth
        InputLabelProps={{ shrink: true }}
        className={classes.formControl}
      />

      <TextField
        name='activeTo'
        label='Active to'
        value={this.formatDate(this.props.rule.activeTo)}
        onChange={this.onDateTimeChange}
        type='datetime-local'
        fullWidth
        InputLabelProps={{ shrink: true }}
        className={classes.formControl}
      />

      <h3>Target</h3>

      <TargetForm
        target={this.props.rule.target}
        onUpdateTarget={this.updateTarget}
      />

      <Button onClick={this.props.onRemoveRule}>
        Remove
      </Button>
    </FormGroup>
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
    const dateTime = '' !== value ? new Date(value) : null
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

  private formatDate (date?: Date): string {
    if (!date) return ''
    return formatInputTime(date)
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
        <MenuItem
          key={resolver}
          value={resolver}
        >{Rule.ResolverEnum[resolver as any]}</MenuItem>)
}

export default withStyles(styles)(RuleForm)
