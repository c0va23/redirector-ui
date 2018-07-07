import * as React from 'react'

import Paper from '@material-ui/core/Paper'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'
import * as log from 'loglevel'

import {
  ConfigApiInterface,
  HostRules,
} from 'redirector-client'

import ButtonLink from '../components/ButtonLink'
import ErrorView from '../components/ErrorView'
import HostRulesView from '../components/HostRulesView'
import Loader from '../components/Loader'

const logger = log.getLogger('HostRulesList')

const styles: StyleRulesCallback = (theme) => ({
  listItemWrapper: {
    margin: theme.spacing.unit * 2,
  },
  newButton: {
    margin: theme.spacing.unit * 2,
  },
})

interface HostRulesListProps {
  configApi: ConfigApiInterface
}

class HostRulesListState {
  hostRulesList?: Array<HostRules>
  errorResponse?: Response
}

class HostRulesList extends React.Component<
  HostRulesListProps
  & WithStyles
  , HostRulesListState
> {
  state = new HostRulesListState()

  componentDidMount () {
    this.fetchHostRulesList()
  }

  render () {
    if (this.state.errorResponse !== undefined) {
      return <ErrorView response={this.state.errorResponse} />
    }

    if (this.state.hostRulesList !== undefined) {
      return this.renderList(this.state.hostRulesList)
    }

    return <Loader label='List loading' />
  }

  private renderList (hostRulesList: Array<HostRules>) {
    return <div>
      <ButtonLink
        to='/host_rules_list/new'
        className={this.props.classes.newButton}
        name='new'
      >
        New
      </ButtonLink>

      {hostRulesList.map(this.renderHostRules)}
    </div>
  }

  private fetchHostRulesList () {
    this.props
      .configApi
      .listHostRules()
      .then(this.setHostRulesList)
      .catch(this.setError)
  }

  private setHostRulesList = (hostRulesList: Array<HostRules>) =>
    this.setState({ hostRulesList })

  private setError = (errorResponse: Response) => {
    logger.error(errorResponse)
    this.setState({ errorResponse })
  }

  private renderHostRules = (hostRules: HostRules) =>
    <Paper
      key={hostRules.host}
      className={this.props.classes.listItemWrapper}
    >
      <HostRulesView
        hostRules={hostRules}
        onDelete={this.deleteHostRules}
      />
    </Paper>

  private deleteHostRules = (host: string) =>
    this
      .props
      .configApi
      .deleteHostRules(host)
      .then(() => this.removeHostRulesFromList(host))
      .catch(logger.error)

  private removeHostRulesFromList = (host: string) =>
    this.setHostRulesList(
      this.state.hostRulesList!
        .filter(hostRule => hostRule.host !== host),
    )
}

export default withStyles(styles)(HostRulesList)
