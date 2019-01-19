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
import * as React from 'react'
import {
  ModelValidationError,
  Rule,
  Target,
} from 'redirector-client'

import AppContext, {
  AppContextData,
} from '../AppContext'
import formatInputTime from '../utils/formatInputTime'
import {
  buildLocalizer,
  findLocaleTranslations,
} from '../utils/localize'
import {
  embedValidationErrors,
  fieldValidationErrors,
} from '../utils/validationErrors'

import TargetForm from './TargetForm'

export type UpdateRule = (rule: Rule) => void
export type RemoveRule = () => void

interface Props {
  rule: Rule,
  ruleIndex: Number,
  onUpdateRule: UpdateRule,
  onRemoveRule: RemoveRule,
  modelError: ModelValidationError,
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
    return <AppContext.Consumer>{this.renderWithContext}</AppContext.Consumer>
  }

  private renderWithContext = (appContext: AppContextData) => {
    let classes = this.props.classes

    let locaeTranslations = findLocaleTranslations(appContext.errorLocales)
    let localizer = buildLocalizer(locaeTranslations)

    return (
      <FormGroup>
        <h3>Rule</h3>

        <TextField
          name='sourcePath'
          label='Source path'
          value={this.props.rule.sourcePath}
          onChange={this.onInputChange}
          className={classes.formControl}
          required
          error={this.fieldErrors('sourcePath').length > 0}
          helperText={this.fieldErrors('sourcePath').map(localizer).join(', ')}
        />

        <FormControl
          className={classes.formControl}
          required
        >
          <InputLabel
            htmlFor={`rule-resolver-${this.props.ruleIndex}`}
          >
            Resolver
          </InputLabel>

          <Select
            name='resolver'
            value={this.props.rule.resolver}
            onChange={this.onSelectChange}
            inputProps={{ id: `rule-resolver-${this.props.ruleIndex}` }}
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
          error={this.fieldErrors('activeFrom').length > 0}
          helperText={this.fieldErrors('activeFrom').map(localizer).join(', ')}
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
          error={this.fieldErrors('activeTo').length > 0}
          helperText={this.fieldErrors('activeTo').map(localizer).join(', ')}
        />

        <h3>Target</h3>

        <TargetForm
          target={this.props.rule.target}
          onUpdateTarget={this.updateTarget}
          modelError={embedValidationErrors(this.props.modelError, 'target')}
        />

        <Button onClick={this.props.onRemoveRule}>
          Remove
        </Button>
      </FormGroup>
    )
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
      .map((resolver) => (
        <MenuItem
          key={resolver}
          value={resolver}
        >
          {Rule.ResolverEnum[resolver as any]}
        </MenuItem>
      ))

  private fieldErrors = (fieldName: string) =>
    fieldValidationErrors(this.props.modelError, fieldName)
      .map(_ => _.translationKey)
}

export default withStyles(styles)(RuleForm)
