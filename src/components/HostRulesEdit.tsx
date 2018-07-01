import * as React from 'react'
import {
  withRouter,
  RouteComponentProps,
} from 'react-router-dom'
import * as Styles from '@material-ui/core/styles'
import * as MaterialUI from '@material-ui/core'
import * as log from 'loglevel'

import {
  HostRules,
  ConfigApiInterface,
} from 'redirector-client'

import HostRulesForm from './HostRulesForm'
import ButtonLink from './ButtonLink'
import ErrorView from './ErrorView'
import Loader from './Loader'

const logger = log.getLogger(module.id)

const styles: Styles.StyleRulesCallback = (theme) => ({
  paper: {
    padding: theme.spacing.unit,
    margin: theme.spacing.unit * 2,
  },
  backButton: {
    margin: theme.spacing.unit * 2,
  },
})

interface MatchParams {
  host: string
}

export interface HostRulesEditProps {
  configApi: ConfigApiInterface
}

class State {
  hostRules?: HostRules
  errorResponse?: Response
}

class HostRulesEdit extends React.Component<
  HostRulesEditProps
  & RouteComponentProps<MatchParams>
  & Styles.WithStyles
  , State
> {
  state = new State()

  componentDidMount () {
    this.fetchHostRules()
  }

  render () {
    if (undefined !== this.state.errorResponse) {
      return <ErrorView response={this.state.errorResponse} />
    }

    if (undefined !== this.state.hostRules) {
      return this.renderForm(this.state.hostRules)
    }

    return <Loader label='Host rules loading...' />
  }

  private renderForm (hostRule: HostRules): JSX.Element {
    return <div>
      <ButtonLink
        to='/host_rules_list'
        className={this.props.classes.backButton}
      >
        List
      </ButtonLink>

      <MaterialUI.Paper className={this.props.classes.paper}>
        <HostRulesForm
          hostRules={hostRule}
          onSave={this.onSave(hostRule)}
          onHostRulesChanged={this.updateHostRules}
        />
      </MaterialUI.Paper>
    </div>
  }

  private fetchHostRules = () =>
    this.props
      .configApi
      .getHostRule(this.props.match.params.host)
      .then(hostRules => this.setState({ hostRules }))
      .catch(errorResponse => this.setState({ errorResponse }))

  private onSave = (hostRules: HostRules) =>
    (onSuccess: () => void, onError: (response: Response) => void) =>
      this.props
        .configApi
        .updateHostRules(this.props.match.params.host, hostRules)
        .then(this.onSuccessSave)
        .then(onSuccess)
        .catch((error: Response) => {
          logger.error(error)
          onError(error)
        })

  private updateHostRules = (hostRules: HostRules) => {
    this.setState({ hostRules })
  }

  private onSuccessSave = (hostRules: HostRules) => {
    this.setState({ hostRules })
    if (this.props.match.params.host !== hostRules.host) {
      this.props.history.push(`/host_rules_list/${hostRules.host}/edit`)
    }
  }
}

const styledComponent = MaterialUI.withStyles(styles)(HostRulesEdit)
export default withRouter(styledComponent)
