import * as React from 'react'
import {
  HashRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import * as MaterialUI from '@material-ui/core'

import { ConfigApi } from '../gen/api-client/index'
import Config from './Config'
import LoginForm from './components/LoginForm'
import HostRulesList from './components/HostRulesList'
import HostRulesEdit from './components/HostRulesEdit'
import HostRulesNew from './components/HostRulesNew'

interface AppState {
  config?: Config,
}

const LOGIN_PATH = '/login'
const HOST_RULES_LIST_PATH = '/host_rules_list'
const HOST_RULES_EDIT_PATH = HOST_RULES_LIST_PATH + '/:host/edit'
const HOST_RULES_NEW_PATH = HOST_RULES_LIST_PATH + '/new'

const CONFIG_KEY = 'config'

export class App extends React.Component<any, AppState> {

  constructor (props: any) {
    super(props)
    this.state = {
      config: this.loadConfig()
    }
  }

  render () {
    return <div>
      <MaterialUI.CssBaseline />

      <MaterialUI.AppBar position='sticky' color='default'>
        <MaterialUI.Toolbar>
          <MaterialUI.Typography variant='title' style={{ flex: 1 }}>
            Redirector
          </MaterialUI.Typography>

          {this.state.config &&
            <MaterialUI.Button onClick={this.logOut}>
              Log out
            </MaterialUI.Button>}
        </MaterialUI.Toolbar>
      </MaterialUI.AppBar>

      {this.routes()}
    </div>
  }

  private logIn = (config: Config) => {
    this.setState({ config })
    this.storeConfig(config)
  }

  private logOut = () => {
    this.setState({ config: undefined })
    this.clearConfig()
  }

  private loginForm () {
    return <LoginForm onSave={this.logIn} />
  }

  private routes (): JSX.Element {
    if (undefined === this.state.config) {
      return this.notAuthorizedRoutes()
    }
    return this.authorizedRoutes(this.state.config)
  }

  private authorizedRoutes (config: Config): JSX.Element {
    let configApi = new ConfigApi(config)
    return <HashRouter>
      <Switch>
        <Route path={HOST_RULES_EDIT_PATH}>
          <HostRulesEdit {...{ configApi }} />
        </Route>

        <Route path={HOST_RULES_NEW_PATH}>
          <HostRulesNew {...{ configApi }} />
        </Route>

        <Route path={HOST_RULES_LIST_PATH}>
        <HostRulesList {...{ configApi }} />
        </Route>

        <Redirect
          exact
          to={HOST_RULES_LIST_PATH}
        />
      </Switch>
    </HashRouter>
  }

  private notAuthorizedRoutes (): JSX.Element {
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

  private loadConfig (): Config | undefined {
    const configJson = sessionStorage.getItem(CONFIG_KEY)
    if (null === configJson) return undefined
    return JSON.parse(configJson)
  }

  private storeConfig (config: Config) {
    const configJson = JSON.stringify(config)
    sessionStorage.setItem(CONFIG_KEY, configJson)
  }

  private clearConfig () {
    sessionStorage.removeItem(CONFIG_KEY)
  }
}
