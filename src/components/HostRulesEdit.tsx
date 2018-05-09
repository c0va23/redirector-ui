import * as React from "react"
import {
  match as Match,
  Link,
} from "react-router-dom";

import {
  HostRules,
  ConfigApi,
} from "../../gen/api-client";

import Config from "../Config";
import HostRulesForm from "./HostRulesForm"

interface MatchParams {
  host: string,
}

interface Props {
  match: Match<MatchParams>,
  config: Config,
}

export default class HostRulesEdit extends React.Component<Props, HostRules> {
  configApi: ConfigApi

  constructor(props: Props) {
    super(props)
    this.configApi = new ConfigApi(props.config)
    this.fetchHostRules()
  }

  render() {
    return <div>
      <Link to="/host_rules_list">
        List
      </Link>
      {this.state == undefined
        ? this.renderLoading()
        : this.renderForm()}
    </div>
  }

  private renderLoading(): JSX.Element {
    return <div>
      Loading...
    </div>
  }

  private renderForm(): JSX.Element {
    return <HostRulesForm
      config={this.props.config}
      hostRules={this.state}
      onSave={this.onSave}
      onUpdateHostRules={this.updateHostRules}
    />
  }

  private fetchHostRules() {
    this.configApi
      .listHostRules()
      .then(this.setHostRule.bind(this))
      .catch(console.log)
  }

  private setHostRule(hostRulesList: Array<HostRules>) {
    const hostRules = hostRulesList.find(
      hostRules => hostRules.host == this.props.match.params.host
    )
    this.setState({...hostRules})
  }

  private onSave = () => {
    this.configApi
      .replaceHostRules(this.state)
      .then(console.log)
      .catch(console.error)
  }

  private updateHostRules = (hostRules: HostRules) => {
    this.setState(hostRules)
  }
}
