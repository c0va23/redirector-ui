import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'
import * as React from 'react'

import Config from '../Config'

export type LogIn = (config: Config) => void

export interface LoginFormProps {
  apiUrl?: string
  logIn: LogIn,
}

const styles: StyleRulesCallback = (theme) => ({
  wrapper: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.unit * 2,
  },
  form: {
    marginTop: theme.spacing.unit,
    marginBottom: 0,
  },
  button: {
    marginTop: theme.spacing.unit,
  },
})

class LoginForm extends React.Component<
  LoginFormProps
  & WithStyles,
  Config
> {
  state: Config = {
    apiUrl: this.props.apiUrl || '',
    username: '',
    password: '',
  }

  render () {
    return (
      <Grid
        container
        justify='center'
        alignItems='center'
        className={this.props.classes.wrapper}
      >
        <Grid
          item
          xl={4}
          md={6}
          sm={8}
          xs={12}
        >
          <Paper className={this.props.classes.content}>
            <Typography variant='headline'>
              Log in
            </Typography>
            {this.renderForm()}
          </Paper>
        </Grid>
      </Grid>
    )
  }

  private renderForm = () => (
    <form
      onSubmit={this.onSubmit}
      className={this.props.classes.form}
    >
      <TextField
        label='API URL'
        name='apiUrl'
        value={this.state.apiUrl}
        onChange={this.onInputChange}
        fullWidth
      />
      <TextField
        label='Username'
        name='username'
        value={this.state.username}
        onChange={this.onInputChange}
        fullWidth
      />
      <TextField
        label='Password'
        name='password'
        type='password'
        value={this.state.password}
        onChange={this.onInputChange}
        fullWidth
      />
      <Button
        type='submit'
        variant='raised'
        className={this.props.classes.button}
      >
        Login
      </Button>
    </form>
  )

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.setState({
      ...this.state,
      [name]: value,
    })
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.props.logIn(this.state)
  }
}

export default withStyles(styles)(LoginForm)
