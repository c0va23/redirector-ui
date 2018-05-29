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
import ButtonLink from "./ButtonLink"

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
    return <div>
      <ButtonLink to="/host_rules_list">
        List
      </ButtonLink>

      <HostRulesForm
        config={this.props.config}
        hostRules={this.state}
        onSave={this.onSave}
        onUpdateHostRules={this.setState.bind(this)}
      />
    </div>
  }

  private onSave = (onError: (response: Response) => void) =>
    this.configApi
      .createHostRules(this.state)
      .then(console.log)
      .catch((error) => {
        console.error(error)
        onError(error)
      })
}
