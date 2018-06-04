import * as React from "react"
import {
  Link,
} from "react-router-dom"
import * as MaterialUI from "@material-ui/core"
import * as Styles from '@material-ui/core/styles'

import {
  ConfigApi,
  HostRules,
} from "../../gen/api-client"

import Config from "../Config"
import ButtonLink from "./ButtonLink"
import HostRulesView from "./HostRulesView"

const styles: Styles.StyleRulesCallback = (theme) => ({
  listItemWrapper: {
    margin: theme.spacing.unit * 2,
  },
})

interface HostRulesListProps {
  config: Config,
}

interface HostRulesListState {
  hostRulesList?: Array<HostRules>,
}

class HostRulesList extends React.Component<
  HostRulesListProps
  & Styles.WithStyles
  , HostRulesListState
> {
  configApi: ConfigApi

  constructor(props: HostRulesListProps & Styles.WithStyles) {
    super(props)
    this.configApi = new ConfigApi(props.config)
    this.fetchHostRulesList()
    this.state = {}
  }

  render() {
    return <div>
      <ButtonLink to="/host_rules_list/new">
        New
      </ButtonLink>

      {this.state.hostRulesList &&
        this.state.hostRulesList.map(this.renderHostRules)}
    </div>
  }

  private fetchHostRulesList() {
    this.configApi
      .listHostRules()
      .then(this.setHostRulesList.bind(this))
      .catch(console.error)
  }

  private setHostRulesList(hostRulesList: Array<HostRules>) {
    this.setState({hostRulesList})
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
    this.configApi
      .deleteHostRules(host)
      .then(() => this.removeHostRulesFromList(host))
      .catch(console.error)

  private removeHostRulesFromList = (host: string) =>
    this.setHostRulesList(
      this.state.hostRulesList!.filter(
        hostRule => hostRule.host != host
      )
    )
}

export default MaterialUI.withStyles(styles)(HostRulesList)
