import * as React from 'react'
import {
  withRouter,
  RouteComponentProps,
} from 'react-router-dom'
import * as Styles from '@material-ui/core/styles'
import * as MaterialUI from '@material-ui/core'

import {
  HostRules,
  ConfigApiInterface,
} from 'redirector-client'

import HostRulesForm from './HostRulesForm'
import ButtonLink from './ButtonLink'

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
    return <div>
      <ButtonLink
        to='/host_rules_list'
        className={this.props.classes.backButton}
      >
        List
      </ButtonLink>

      <MaterialUI.Paper className={this.props.classes.paper}>
        {this.state.hostRules === undefined
          ? this.renderLoading()
          : this.renderForm(this.state.hostRules)}
      </MaterialUI.Paper>
    </div>
  }

  private renderLoading (): JSX.Element {
    return <div>
      Loading...
    </div>
  }

  private renderForm (hostRule: HostRules): JSX.Element {
    return <HostRulesForm
      hostRules={hostRule}
      onSave={this.onSave(hostRule)}
      onHostRulesChanged={this.updateHostRules}
    />
  }

  private fetchHostRules = () =>
    this.props
      .configApi
      .getHostRule(this.props.match.params.host)
      .then(hostRules => this.setState({ hostRules }))
      .catch(console.error)

  private onSave = (hostRules: HostRules) =>
    (onSuccess: () => void, onError: (response: Response) => void) =>
      this.props
        .configApi
        .updateHostRules(this.props.match.params.host, hostRules)
        .then(this.onSuccessSave)
        .then(onSuccess)
        .catch((error: Response) => {
          console.error(error)
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
