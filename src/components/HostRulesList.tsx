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

  private renderHostRules(hostRules: HostRules): JSX.Element {
    return <MaterialUI.Paper key={hostRules.host}>
      <MaterialUI.Toolbar>
        <MaterialUI.Typography variant="headline" style={{flex: 1}}>
          {hostRules.host}
        </MaterialUI.Typography>

        <ButtonLink to={`/host_rules_list/${hostRules.host}/edit`}>
          Edit
        </ButtonLink>
      </MaterialUI.Toolbar>

      <MaterialUI.Table>
        <MaterialUI.TableHead>
          <MaterialUI.TableRow>
            <MaterialUI.TableCell>
              Source
            </MaterialUI.TableCell>
            <MaterialUI.TableCell>
              Target (Code)
            </MaterialUI.TableCell>
            <MaterialUI.TableCell>
              Target (Path)
            </MaterialUI.TableCell>
            <MaterialUI.TableCell>
              Active from
            </MaterialUI.TableCell>
            <MaterialUI.TableCell>
              Active to
            </MaterialUI.TableCell>
          </MaterialUI.TableRow>
        </MaterialUI.TableHead>
        <MaterialUI.TableBody>
          {hostRules.rules.map((rule, index) =>
            <MaterialUI.TableRow key={index}>
              <MaterialUI.TableCell>{rule.sourcePath}</MaterialUI.TableCell>
              <MaterialUI.TableCell>{rule.target.httpCode}</MaterialUI.TableCell>
              <MaterialUI.TableCell>{rule.target.path}</MaterialUI.TableCell>
              <MaterialUI.TableCell>{rule.activeFrom}</MaterialUI.TableCell>
              <MaterialUI.TableCell>{rule.activeTo}</MaterialUI.TableCell>
            </MaterialUI.TableRow>
          )}
        </MaterialUI.TableBody>
      </MaterialUI.Table>
    </MaterialUI.Paper>
  }
}
