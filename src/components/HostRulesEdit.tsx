import * as React from 'react'

import Paper from '@material-ui/core/Paper'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'
import * as log from 'loglevel'
import {
  RouteComponentProps,
  withRouter,
} from 'react-router-dom'

import {
  ConfigApiInterface,
  HostRules,
} from 'redirector-client'

import ButtonLink from './ButtonLink'
import ErrorView from './ErrorView'
import HostRulesForm from './HostRulesForm'
import Loader from './Loader'

const logger = log.getLogger('HostRulesEdit')

const styles: StyleRulesCallback = (theme) => ({
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
  & WithStyles
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

      <Paper className={this.props.classes.paper}>
        <HostRulesForm
          hostRules={hostRule}
          onSave={this.onSave(hostRule)}
          onUpdateHostRules={this.updateHostRules}
        />
      </Paper>
    </div>
  }

  private fetchHostRules = () =>
    this.props
      .configApi
      .getHostRule(this.props.match.params.host)
      .then((hostRules: HostRules) => this.setState({ hostRules }))
      .catch((errorResponse: Response) => this.setState({ errorResponse }))

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

const styledComponent = withStyles(styles)(HostRulesEdit)
export default withRouter(styledComponent)
