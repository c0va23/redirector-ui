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
  Locales,
} from 'redirector-client'

import AppContext from './AppContext'
import Config, {
  ConfigApiBuilder,
  ConfigStore,
} from './Config'
import {
  AuthorizedRoutes,
  UnauthorizedRoutes,
} from './routes'

import Loader from './components/Loader'

class AppState {
  errorLocales?: Locales

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
    return (
      <div className={classes.wrapper}>
        <CssBaseline />

        <AppBar position='sticky' color='default'>
          <Toolbar>
            <Typography variant='title' className={classes.toolBarTitle}>
              Redirector
            </Typography>

            {this.logOutButton()}
          </Toolbar>
        </AppBar>

        {this.routes()}
      </div>
    )
  }

  componentDidMount () {
    if (undefined !== this.state.config) {
      this.loadErrorLocales(this.state.config)
    }
  }

  private logIn = (config: Config) => {
    this.setState({ config })
    this.props.configStore.store(config)
    this.loadErrorLocales(config)
  }

  private logOut = () => {
    this.setState({ config: undefined })
    this.props.configStore.clear()
  }

  private logOutButton () {
    if (undefined === this.state.config) return undefined
    return (
      <Button
        name='logOut'
        onClick={this.logOut}
      >
        Log out
      </Button>
    )
  }

  private routes (): JSX.Element {
    if (undefined === this.state.config) {
      return this.props.unauthorizedRoutes({
        apiUrl: this.props.apiUrl,
        logIn: this.logIn,
      })
    }

    if (undefined === this.state.errorLocales) {
      return <Loader label='Load locales...' />
    }

    let configApi = this.props.configApiBuilder(this.state.config)
    return (
      <AppContext.Provider value={{ errorLocales: this.state.errorLocales }}>
        {this.props.authorizedRoutes({ configApi })}
      </AppContext.Provider>
    )
  }

  private loadErrorLocales (config: Config) {
    this.props.configApiBuilder(config)
      .locales().then(this.setErrorLocales)
  }

  private setErrorLocales = (locales: Locales) =>
    this.setState({
      errorLocales: locales,
    })
}

export default withStyles(styles)(App)
