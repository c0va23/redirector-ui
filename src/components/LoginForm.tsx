import * as React from 'react'
import * as MaterialUI from '@material-ui/core'
import * as Styles from '@material-ui/core/styles'

import Config from '../Config'

interface LoginFormProps {
  onSave: (config: Config) => void,
}

const styles: Styles.StyleRulesCallback = (theme: MaterialUI.Theme): Styles.StyleRules => {
  return {
    content: {
      padding: theme.spacing.unit * 2
    }
  }
}

class LoginForm extends React.Component<LoginFormProps & Styles.WithStyles, Config> {
  state: Config = {
    basePath: '',
    username: '',
    password: ''
  }

  render () {
    return <MaterialUI.Grid
      container
      justify='center'
    >
      <MaterialUI.Grid
        item
        xs={4}
      >
        <MaterialUI.Paper className={this.props.classes.content}>
          <MaterialUI.Typography variant='subheading'>
            Log in
          </MaterialUI.Typography>
          {this.renderForm()}
        </MaterialUI.Paper>
      </MaterialUI.Grid>
    </MaterialUI.Grid>
  }

  private renderForm (): JSX.Element {
    return <form onSubmit={this.onSubmit}>
      <MaterialUI.TextField
        label='Base path'
        name='basePath'
        value={this.state.basePath}
        onChange={this.onInputChange}
        fullWidth
      />
      <MaterialUI.TextField
        label='Username'
        name='username'
        value={this.state.username}
        onChange={this.onInputChange}
        fullWidth
      />
      <MaterialUI.TextField
        label='Password'
        name='password'
        type='password'
        value={this.state.password}
        onChange={this.onInputChange}
        fullWidth
      />
      <MaterialUI.Button
        type='submit'
        variant='raised'
      >
        Login
      </MaterialUI.Button>
    </form>
  }

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.props.onSave(this.state)
  }
}

export default MaterialUI.withStyles(styles)(LoginForm)
