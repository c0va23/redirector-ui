import * as React from "react"
import {
  Link,
} from "react-router-dom"
import * as MaterialUI from "material-ui"

import {
  ConfigApi,
  HostRules,
} from "../../gen/api-client"

import Config from "../Config"
import ButtonLink from "./ButtonLink"
import HostRulesView from "./HostRulesView"

interface HostRulesListProps {
  config: Config,
}

interface HostRulesListState {
  hostRulesList?: Array<HostRules>,
}

export default class HostRulesList extends React.Component<HostRulesListProps, HostRulesListState> {
  configApi: ConfigApi

  constructor(props: HostRulesListProps) {
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
    >
      <HostRulesView hostRules={hostRules} />
    </MaterialUI.Paper>
}
