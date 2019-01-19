import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'
import Close from '@material-ui/icons/Close'
import * as React from 'react'
import {
  HostRules,
  ModelValidationError,
} from 'redirector-client'

import HostRulesForm, {
  UpdateHostRules,
} from './HostRulesForm'

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

export type SuccessSaveCb = () => void
export type ErrorSaveCb = (response: Response) => void

export type SaveHostRules = (
  onSuccess: SuccessSaveCb,
  onError: ErrorSaveCb,
) => void

export interface HostRulesFormWrapperProps {
  hostRules: HostRules,
  onSaveHostRules: SaveHostRules,
  onUpdateHostRules: UpdateHostRules,
}

interface Message {
  text: string
  className: string,
}

class State {
  message?: Message
  loading: boolean = false
  modelError: ModelValidationError = []
}

class HostRulesFormWrapper extends React.Component<
  HostRulesFormWrapperProps
  & WithStyles,
  State
> {
  state = new State()

  render () {
    return (
      <form onSubmit={this.onSubmit}>
        <HostRulesForm
          hostRules={this.props.hostRules}
          modelError={this.state.modelError}
          onUpdateHostRules={this.props.onUpdateHostRules}
        />

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
              name='save'
              disabled={this.state.loading}
              className={this.props.classes.button}
            >
              Save
            </Button>
            {this.renderLoader()}
          </div>
        </div>
      </form>
    )
  }

  private renderLoader () {
    if (!this.state.loading) return undefined
    return (
      <CircularProgress
        id='saveLoader'
        variant='indeterminate'
        size={circularSize}
        className={this.props.classes.buttonProgress}
      />
    )
  }

  private renderCloseButton = () => (
    <IconButton
      key='errorMessage'
      onClick={this.clearError}
    >
      <Close />
    </IconButton>
  )

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.setState({ loading: true })
    this.props.onSaveHostRules(this.onSuccessSave, this.onErrorError)
  }

  private onSuccessSave = () =>
    this.setState({
      message: {
        text: 'Success',
        className: this.props.classes.infoMessage,
      },
      loading: false,
    })

  private onErrorError = (response: Response) => {
    switch (response.status) {
      case 422:
        return this.setValidationError(response)
      default:
        return this.setSimpleError(response)
    }
  }

  private setValidationError = (response: Response) =>
    response.json()
      .then((modelError: ModelValidationError) =>
        this.setState({
          loading: false,
          modelError,
        }),
      )
      .catch(this.showMessage)

  private setSimpleError = (response: Response) =>
    response.text()
      .then(reason =>
        this.setState({
          message: {
            text: reason,
            className: this.props.classes.errorMessage,
          },
          loading: false,
        }),
      )
      .catch(this.showMessage)

  private showMessage = (rejected: { reason: any }) => {
    this.setState({
      message: {
        text: rejected.reason.valueOf(),
        className: this.props.classes.errorMessage,
      },
      loading: false,
    })
  }

  private clearError = () => this.setState({ message: undefined })
}

export default withStyles(styles)(HostRulesFormWrapper)
