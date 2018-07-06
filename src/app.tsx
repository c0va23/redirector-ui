import * as React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'
import {
  HashRouter,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

import { ConfigApi } from 'redirector-client'

import Config from './Config'
import HostRulesEdit from './components/HostRulesEdit'
import HostRulesList from './components/HostRulesList'
import HostRulesNew from './components/HostRulesNew'
import LoginForm from './components/LoginForm'

class AppState {
  config?: Config
}

interface Props {
  apiUrl?: string
}

const LOGIN_PATH = '/login'
const HOST_RULES_LIST_PATH = '/host_rules_list'
const HOST_RULES_EDIT_PATH = HOST_RULES_LIST_PATH + '/:host/edit'
const HOST_RULES_NEW_PATH = HOST_RULES_LIST_PATH + '/new'

const CONFIG_KEY = 'config'

const styles: StyleRulesCallback =
  (_theme) => ({
    wrapper: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  })

class App extends React.Component<Props & WithStyles, AppState> {
  state = new AppState()

  componentDidMount () {
    this.setState({ config: this.loadConfig() })
  }

  render () {
    return <div className={this.props.classes.wrapper}>
      <CssBaseline />

      <AppBar position='sticky' color='default'>
        <Toolbar>
          <Typography variant='title' style={{ flex: 1 }}>
            Redirector
          </Typography>

          {this.state.config &&
            <Button onClick={this.logOut}>
              Log out
            </Button>}
        </Toolbar>
      </AppBar>

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
    return <LoginForm apiUrl={this.props.apiUrl} onSave={this.logIn} />
  }

  private routes (): JSX.Element {
    if (undefined === this.state.config) {
      return this.notAuthorizedRoutes()
    }
    return this.authorizedRoutes(this.state.config)
  }

  private authorizedRoutes (config: Config): JSX.Element {
    let configApi = new ConfigApi({
      basePath: config.apiUrl,
      username: config.username,
      password: config.password,
    })
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

export default withStyles(styles)(App)
