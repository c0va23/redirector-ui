import * as React from 'react'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import TextField from '@material-ui/core/TextField'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'
import Close from '@material-ui/icons/Close'

import {
  HostRules,
  Rule,
  Target,
} from 'redirector-client'

import RuleForm from './RuleForm'
import TargetForm from './TargetForm'

const circularSize = 24

const styles: StyleRulesCallback = (theme) => ({
  actionsPanel: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  errorMessage: {
    backgroundColor: theme.palette.error.light,
  },
  infoMessage: {
    backgroundColor: theme.palette.primary.light,
  },
  buttonWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    marginTop: -circularSize / 2,
    marginLeft: -circularSize / 2,
    left: '50%',
    top: '50%',
  },
})

export type UpdateHostRules = (hostRules: HostRules) => void

export type SuccessSaveCb = () => void
export type ErrorSaveCb = (response: Response) => void

export type SaveHostRules = (
  onSuccess: SuccessSaveCb,
  onError: ErrorSaveCb,
) => void

export interface HostRulesFormProps {
  hostRules: HostRules,
  onUpdateHostRules: UpdateHostRules,
  onSave: SaveHostRules,
}

interface Message {
  text: string
  className: string,
}

class State {
  message?: Message
  loading: boolean = false
}

class HostRulesForm extends React.Component<
  HostRulesFormProps
  & WithStyles
  , State
> {
  state = new State()

  render () {
    return <form onSubmit={this.onSubmit}>
      <TextField
        name='host'
        label='Host'
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

      <FormControl fullWidth>
        {this.props.hostRules.rules.map(this.renderRuleForm)}

        <Button name='addRule' onClick={this.addRule}>
          Add
        </Button>
      </FormControl>

      <br />

      <Snackbar
        open={this.state.message !== undefined}
      >
        <SnackbarContent
          message={<p>{this.state.message && this.state.message.text}</p>}
          className={this.state.message && this.state.message.className}
          action={this.renderCloseButton()}
        />
      </Snackbar>

      <div className={this.props.classes.actionsPanel}>
        <div className={this.props.classes.buttonWrapper}>
          <Button
            type='submit'
            color='primary'
            variant='raised'
            disabled={this.state.loading}
            className={this.props.classes.button}
          >
            Save
          </Button>
          {this.renderLoader()}
        </div>
      </div>
    </form>
  }

  private renderRuleForm = (rule: Rule, index: number) =>
    <RuleForm
      key={index}
      rule={rule}
      ruleIndex={index}
      onUpdateRule={this.updateRule(index)}
      onRemoveRule={this.removeRule(index)}
    />

  private renderLoader () {
    if (!this.state.loading) return undefined
    return (
      <CircularProgress
        variant='indeterminate'
        size={circularSize}
        className={this.props.classes.buttonProgress}
      />
    )
  }

  private renderCloseButton = () =>
    <IconButton
      key='errorMessage'
      onClick={this.clearError}
    >
      <Close />
    </IconButton>

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
    this.setState({ loading: true })
    this.props.onSave(this.onSuccessSave, this.onErrorError)
  }

  private onSuccessSave = () =>
    this.setState({
      message: {
        text: 'Success',
        className: this.props.classes.infoMessage,
      },
      loading: false,
    })

  private onErrorError = (response: Response) =>
    response.text().then(reason =>
      this.setState({
        message: {
          text: reason,
          className: this.props.classes.errorMessage,
        },
        loading: false,
      }),
    )

  private clearError = () => this.setState({ message: undefined })

  private updateTarget = (target: Target) => {
    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      defaultTarget: target,
    })
  }

  private updateRule = (index: number) => (rule: Rule) => {
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

  private removeRule = (index: number) => () => {
    const newRules = [
      ...this.props.hostRules.rules.slice(0, index),
      ...this.props.hostRules.rules.slice(index + 1),
    ]

    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      rules: newRules,
    })
  }

  private addRule = () => {
    const newRules = this.props.hostRules.rules.concat([{
      sourcePath: '',
      resolver: Rule.ResolverEnum.Simple,
      target: {
        httpCode: 301,
        path: '',
      },
    }])

    this.props.onUpdateHostRules({
      ...this.props.hostRules,
      rules: newRules,
    })
  }
}

export default withStyles(styles)(HostRulesForm)
