import * as React from 'react'
import * as MaterialUI from '@material-ui/core'
import * as Styles from '@material-ui/core/styles'

import {
  HostRules,
  ConfigApiInterface,
} from 'redirector-client'

import ButtonLink from './ButtonLink'
import HostRulesView from './HostRulesView'
import ErrorView from './ErrorView'
import Loader from './Loader'

const styles: Styles.StyleRulesCallback = (theme) => ({
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
  & Styles.WithStyles
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
    console.error(errorResponse)
    this.setState({ errorResponse })
  }

  private renderHostRules = (hostRules: HostRules) =>
    <MaterialUI.Paper
      key={hostRules.host}
      className={this.props.classes.listItemWrapper}
    >
      <HostRulesView
        hostRules={hostRules}
        onDelete={this.deleteHostRules}
      />
    </MaterialUI.Paper>

  private deleteHostRules = (host: string) =>
    this
      .props
      .configApi
      .deleteHostRules(host)
      .then(() => this.removeHostRulesFromList(host))
      .catch(console.error)

  private removeHostRulesFromList = (host: string) =>
    this.setHostRulesList(
      this.state.hostRulesList!
        .filter(hostRule => hostRule.host !== host),
    )
}

export default MaterialUI.withStyles(styles)(HostRulesList)
