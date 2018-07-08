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

import Config, {
  ConfigApiBuilder,
  ConfigStore,
} from './Config'
import {
  AuthorizedRoutes,
  UnauthorizedRoutes,
} from './routes'

class AppState {
  constructor (
    readonly config?: Config,
  ) {}
}

export interface AppProps {
  apiUrl?: string
  configApiBuilder: ConfigApiBuilder
  configStore: ConfigStore
  authorizedRoutes: AuthorizedRoutes
  unauthorizedRoutes: UnauthorizedRoutes
}

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
  state = new AppState(this.props.configStore.load())

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
      return this.props.unauthorizedRoutes({
        apiUrl: this.props.apiUrl,
        logIn: this.logIn,
      })
    }
    let configApi = this.props.configApiBuilder(this.state.config)
    return this.props.authorizedRoutes({ configApi })
  }
}

export default withStyles(styles)(App)