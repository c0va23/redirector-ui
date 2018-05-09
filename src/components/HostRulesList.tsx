import * as React from "react"
import {
  Link,
} from "react-router-dom"

import {
  ConfigApi,
  HostRules,
} from "../../gen/api-client"

import Config from "../Config"

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
      <Link to={`/host_rules_list/new`}>
        New
      </Link>
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

  private renderHostRules(hostRules: HostRules): JSX.Element {
    return <section key={hostRules.host}>
      <h2>{hostRules.host}</h2>
      <Link to={`/host_rules_list/${hostRules.host}/edit`}>
        Edit
      </Link>
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Target (Code)</th>
            <th>Target (Path)</th>
            <th>Active from</th>
            <th>Active to</th>
          </tr>
        </thead>
        <tbody>
          {hostRules.rules.map((rule, index) =>
            <tr key={index}>
              <td>{rule.sourcePath}</td>
              <td>{rule.target.httpCode}</td>
              <td>{rule.target.path}</td>
              <td>{rule.activeFrom}</td>
              <td>{rule.activeTo}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  }
}
