import * as React from "react"
import {
  match as Match,
  Link,
  withRouter,
  RouteComponentProps,
} from "react-router-dom";

import {
  HostRules,
  ConfigApi,
} from "../../gen/api-client";

import Config from "../Config";
import HostRulesForm from "./HostRulesForm"
import ButtonLink from "./ButtonLink"

interface MatchParams {
  host: string,
}

interface Props {
  config: Config,
}

class HostRulesEdit extends React.Component<Props & RouteComponentProps<MatchParams>, HostRules> {
  configApi: ConfigApi

  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props)
    this.configApi = new ConfigApi(props.config)
    this.fetchHostRules()
  }

  render() {
    return <div>
      <ButtonLink to="/host_rules_list">
        List
      </ButtonLink>

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

  private fetchHostRules = () =>
    this.configApi
      .getHostRule(this.props.match.params.host)
      .then(hostRules => this.setState(hostRules))
      .catch(console.log)

  private onSave = (onError: (response: Response) => void) =>
    this.configApi
      .updateHostRules(this.props.match.params.host, this.state)
      .then(this.onSuccessSave)
      .catch((error) => {
        console.error(error)
        onError(error)
      })

  private updateHostRules = (hostRules: HostRules) => {
    this.setState(hostRules)
  }

  private onSuccessSave = (hostRules: HostRules) => {
    this.setState(hostRules)
    if(this.props.match.params.host != hostRules.host)
      this.props.history.push(`/host_rules_list/${hostRules.host}/edit`)
  }
}

export default withRouter(HostRulesEdit)
