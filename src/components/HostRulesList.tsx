import * as React from "react"
import {
  ConfigApi,
  HostRules,
} from "../../gen/api-client/index"
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
    this.state = {
      hostRulesList: null
    }
  }

  render() {
    return <div>
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
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Target</th>
            <th>Active from</th>
            <th>Active to</th>
          </tr>
        </thead>
        <tbody>
          {hostRules.rules.map(rule =>
            <tr key={rule.sourcePath}>
              <td>{rule.sourcePath}</td>
              <td>{rule.target}</td>
              <td>{rule.activeFrom}</td>
              <td>{rule.activeTo}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  }
}
