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
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

import { ConfigApiInterface } from 'redirector-client'

import Config, {
  ConfigApiBuilder,
  ConfigStore,
} from './Config'

import HostRulesEdit from './pages/HostRulesEdit'
import HostRulesList from './pages/HostRulesList'
import HostRulesNew from './pages/HostRulesNew'
import LoginForm from './pages/LoginForm'

class AppState {
  config?: Config
}

export interface AppProps {
  apiUrl?: string
  configApiBuilder: ConfigApiBuilder
  configStore: ConfigStore
}

const LOGIN_PATH = '/login'
const HOST_RULES_LIST_PATH = '/host_rules_list'
const HOST_RULES_EDIT_PATH = HOST_RULES_LIST_PATH + '/:host/edit'
const HOST_RULES_NEW_PATH = HOST_RULES_LIST_PATH + '/new'

const styles: StyleRulesCallback =
  (_theme) => ({
    toolBarTitle: {
      flex: 1,
    },
    wrapper: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  })

class App extends React.Component<AppProps & WithStyles, AppState> {
  state = new AppState()

  componentDidMount () {
    this.setState({
      config: this.props.configStore.load(),
    })
  }

  render () {
    let classes = this.props.classes
    return <div className={classes.wrapper}>
      <CssBaseline />

      <AppBar position='sticky' color='default'>
        <Toolbar>
          <Typography variant='title' className={classes.toolBarTitle}>
            Redirector
          </Typography>

          {this.state.config &&
            <Button
              name='logOut'
              onClick={this.logOut}
            >
              Log out
            </Button>}
        </Toolbar>
      </AppBar>

      {this.routes()}
    </div>
  }

  private logIn = (config: Config) => {
    this.setState({ config })
    this.props.configStore.store(config)
  }

  private logOut = () => {
    this.setState({ config: undefined })
    this.props.configStore.clear()
  }

  private routes (): JSX.Element {
    if (undefined === this.state.config) {
      return this.notAuthorizedRoutes()
    }
    let configApi = this.props.configApiBuilder(this.state.config)
    return this.authorizedRoutes(configApi)
  }

  private authorizedRoutes = (configApi: ConfigApiInterface) =>
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

  private notAuthorizedRoutes = () =>
    <Switch>
      <Route path={LOGIN_PATH}>
        <LoginForm apiUrl={this.props.apiUrl} logIn={this.logIn} />
      </Route>

      <Redirect to={LOGIN_PATH} />
    </Switch>
}

export default withStyles(styles)(App)
