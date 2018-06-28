import * as React from 'react'
import * as MaterialUI from '@material-ui/core'
import * as Styles from '@material-ui/core/styles'
import * as MaterialUIIcons from '@material-ui/icons'

import {
  HostRules,
  Target,
  Rule,
} from 'redirector-client'

import TargetForm from './TargetForm'
import RuleForm from './RuleForm'

const styles: Styles.StyleRulesCallback = (theme) => ({
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
})

export type OnChange = (hostRules: HostRules) => void

export type SuccessSaveCb = () => void
export type ErrorSaveCb = (response: Response) => void

export type OnSave = (
  onSuccess: SuccessSaveCb,
  onError: ErrorSaveCb,
) => void

interface Props {
  hostRules: HostRules,
  onHostRulesChanged: OnChange,
  onSave: OnSave,
}

interface Message {
  text: string
  className: string,
}

class State {
  message?: Message
}

class HostRulesForm extends React.Component<
  Props
  & Styles.WithStyles
  , State
> {
  state = new State()

  render () {
    return <form onSubmit={this.onSubmit}>
      <MaterialUI.TextField
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

      <MaterialUI.FormControl fullWidth>
        {this.props.hostRules.rules.map((rule, index) =>
          <RuleForm
            key={index}
            rule={rule}
            ruleIndex={index}
            onUpdateRule={(rule: Rule) => this.updateRule(index, rule)}
            onRemoveRule={() => this.removeRule(index)}
          />)
        }

        <MaterialUI.Button name='addRule' onClick={() => this.addRule()}>
          Add
        </MaterialUI.Button>
      </MaterialUI.FormControl>

      <br />

      <MaterialUI.Snackbar
        open={this.state.message !== undefined}
      >
        <MaterialUI.SnackbarContent
          message={<p>{this.state.message && this.state.message.text}</p>}
          className={this.state.message && this.state.message.className}
          action={
            <MaterialUI.IconButton
              key='errorMessage'
              onClick={() => this.clearError()}
            >
              <MaterialUIIcons.Close/>
            </MaterialUI.IconButton>
          }
        />
      </MaterialUI.Snackbar>

      <div className={this.props.classes.actionsPanel}>
        <MaterialUI.Button
          type='submit'
          color='primary'
          variant='raised'
        >
          Save
        </MaterialUI.Button>
      </div>
    </form>
  }

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.props.onHostRulesChanged({
      ...this.props.hostRules,
      [name]: value,
    })
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.props.onSave(this.onSuccessSave, this.onErrorError)
  }

  private onSuccessSave = () =>
    this.setState({
      message: {
        text: 'Success',
        className: this.props.classes.infoMessage,
      },
    })

  private onErrorError = (response: Response) =>
    response.text().then(reason =>
      this.setState({
        message: {
          text: reason,
          className: this.props.classes.errorMessage,
        },
      }),
    )

  private clearError = () => this.setState({ message: undefined })

  private updateTarget = (target: Target) => {
    this.props.onHostRulesChanged({
      ...this.props.hostRules,
      defaultTarget: target,
    })
  }

  private updateRule (index: number, rule: Rule) {
    const rules = [
      ...this.props.hostRules.rules.slice(0, index),
      rule,
      ...this.props.hostRules.rules.slice(index + 1),
    ]

    const hostRules: HostRules = {
      ...this.props.hostRules,
      rules,
    }

    this.props.onHostRulesChanged(hostRules)
  }

  private removeRule (index: number) {
    const newRules = [
      ...this.props.hostRules.rules.slice(0, index),
      ...this.props.hostRules.rules.slice(index + 1),
    ]

    this.props.onHostRulesChanged({
      ...this.props.hostRules,
      rules: newRules,
    })
  }

  private addRule () {
    const newRules = this.props.hostRules.rules.concat([{
      sourcePath: '',
      resolver: Rule.ResolverEnum.Simple,
      target: {
        httpCode: 301,
        path: '',
      },
    }])

    this.props.onHostRulesChanged({
      ...this.props.hostRules,
      rules: newRules,
    })
  }
}

export default MaterialUI.withStyles(styles)(HostRulesForm)
