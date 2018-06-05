import * as React from "react"
import {
  Link,
  withRouter,
  RouteComponentProps,
} from "react-router-dom";
import * as MaterialUI from '@material-ui/core'
import * as Styles from '@material-ui/core/styles'

import {
  HostRules,
  ConfigApi,
} from "../../gen/api-client";

import Config from "../Config";
import HostRulesForm from "./HostRulesForm"
import ButtonLink from "./ButtonLink"

const styles: Styles.StyleRulesCallback = (theme) => ({
  paper: {
    padding: theme.spacing.unit,
    margin: theme.spacing.unit * 2,
  },
  backButton: {
    margin: theme.spacing.unit * 2,
  },
})

interface Props {
  config: Config,
}

class HostRulesNew extends React.Component<
  Props
  & RouteComponentProps<never>
  & Styles.WithStyles
  , HostRules
> {
  configApi: ConfigApi

  constructor(props: Props & RouteComponentProps<never> & Styles.WithStyles) {
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
      <ButtonLink to="/host_rules_list" className={this.props.classes.backButton}>
        List
      </ButtonLink>

      <MaterialUI.Paper className={this.props.classes.paper}>
        <HostRulesForm
          hostRules={this.state}
          onSave={this.onSave}
          onHostRulesChanged={this.setState.bind(this)}
        />
      </MaterialUI.Paper>
    </div>
  }

  private onSave = (onSuccess: () => void, onError: (response: Response) => void) =>
    this.configApi
      .createHostRules(this.state)
      .then((hostRules: HostRules) => {
        onSuccess()
        this.redirectToEditPage(hostRules)
      })
      .catch((error) => {
        console.error(error)
        onError(error)
      })

  private redirectToEditPage = (hostRules: HostRules): void =>
      this.props
        .history
        .push(`/host_rules_list/${hostRules.host}/edit`)
}

const styledHostRulesNew = MaterialUI.withStyles(styles)(HostRulesNew)
export default withRouter(styledHostRulesNew)
