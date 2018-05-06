import * as React from "react"
import {
  HashRouter,
  Route,
  Redirect,
  Switch,
} from "react-router-dom"

import Config from "./Config"
import LoginForm from "./components/LoginForm"
import HostRulesList from "./components/HostRulesList"

interface AppState {
  config?: Config,
}

const LOGIN_PATH = "/login"
const HOST_RULES_LIST_PATH = '/host_rules_list'

export class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props)
    this.state = {}
  }

  render() {
    return <div>
      <h1>Redirector!!!</h1>
      {this.routes()}
    </div>
  }

  private onLogin(config: Config) {
    this.setState({config})
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
}
