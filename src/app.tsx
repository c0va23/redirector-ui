import * as React from "react"
import {
  HashRouter,
  Route,
  Redirect,
  Switch,
  match as Match,
} from "react-router-dom"

import Config from "./Config"
import LoginForm from "./components/LoginForm"
import HostRulesList from "./components/HostRulesList"
import HostRulesEdit from "./components/HostRulesEdit"
import HostRulesNew from "./components/HostRulesNew"

interface AppState {
  config?: Config,
}

const LOGIN_PATH = "/login"
const HOST_RULES_LIST_PATH = '/host_rules_list'
const HOST_RULES_EDIT_PATH = HOST_RULES_LIST_PATH + '/:host/edit'
const HOST_RULES_NEW_PATH = HOST_RULES_LIST_PATH + '/new'

const CONFIG_KEY = "config"

export class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props)
    this.state = {
      config: this.loadConfig(),
    }
  }

  render() {
    return <div>
      <h1>Redirector!!!</h1>
      {this.routes()}
    </div>
  }

  private onLogin(config: Config) {
    this.setState({config})
    this.storeConfig(config)
  }

  private loginForm() {
    return <LoginForm onSave={this.onLogin.bind(this)} />
  }

  private routes(): JSX.Element {
    if(this.state.config == null) {
      return this.notAuthorizedRoutes()
    }
    return this.authorizedRoutes()
  }

  private authorizedRoutes(): JSX.Element {
    return <HashRouter>
      <Switch>
        <Route
          path={HOST_RULES_EDIT_PATH}
          component={this.renderHostRulesForm.bind(this)}
        />

        <Route
          path={HOST_RULES_NEW_PATH}
          component={() => <HostRulesNew config={this.state.config!} />}
        />

        <Route
          path={HOST_RULES_LIST_PATH}
          component={() => <HostRulesList config={this.state.config!}/>}
        />

        <Redirect
          exact
          to={HOST_RULES_LIST_PATH}
        />
      </Switch>
    </HashRouter>
  }

  private notAuthorizedRoutes(): JSX.Element {
    return <HashRouter>
      <Switch>
        <Route
          path={LOGIN_PATH}
          render={this.loginForm.bind(this)}
        />

        <Redirect
          to={LOGIN_PATH}
        />
      </Switch>
    </HashRouter>
  }

  private renderHostRulesForm({match}: {match: Match<{host: string}>}): JSX.Element {
    return <HostRulesEdit
      config={this.state.config!}
      match={match}
    />
  }

  private loadConfig(): Config | undefined {
    const configJson = sessionStorage.getItem(CONFIG_KEY)
    if(undefined === configJson)
      return
    return JSON.parse(configJson!) as Config
  }

  private storeConfig(config: Config) {
    const configJson = JSON.stringify(config)
    sessionStorage.setItem(CONFIG_KEY, configJson)
  }
}
