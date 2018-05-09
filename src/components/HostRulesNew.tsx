import * as React from "react"
import {
  match as Match,
} from "react-router/index";

import {
  HostRules,
  ConfigApi,
} from "../../gen/api-client/api";

import Config from "../Config";
import HostRulesForm from "./HostRulesForm"

interface Props {
  config: Config,
}

export default class HostRulesNew extends React.Component<Props, HostRules> {
  configApi: ConfigApi

  constructor(props: Props) {
    super(props)
    this.configApi = new ConfigApi(props.config)
    this.state = {
      host: "",
      defaultTarget: {
        path: "",
        httpCode: 301,
      },
      rules: [],
    }
  }

  render() {
    return <HostRulesForm
      config={this.props.config}
      hostRules={this.state}
      onSave={this.onSave.bind(this)}
      onUpdateHostRules={this.setState.bind(this)}
    />
  }

  private onSave() {
    this.configApi
      .replaceHostRules(this.state)
      .then(console.log)
      .catch(console.error)
  }
}
