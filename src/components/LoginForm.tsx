import * as React from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'

import Config from '../Config'

interface LoginFormProps {
  apiUrl?: string
  onSave: (config: Config) => void,
}

const styles: StyleRulesCallback = (theme) => ({
  wrapper: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.unit * 2,
  },
})

class LoginForm extends React.Component<
  LoginFormProps
  & WithStyles,
  Config
> {
  state: Config = {
    basePath: this.props.apiUrl || '',
    username: '',
    password: '',
  }

  render () {
    return <Grid
      container
      justify='center'
      alignItems='center'
      className={this.props.classes.wrapper}
    >
      <Grid
        item
        md={4}
        xs={12}
      >
        <Paper className={this.props.classes.content}>
          <Typography variant='subheading'>
            Log in
          </Typography>
          {this.renderForm()}
        </Paper>
      </Grid>
    </Grid>
  }

  private renderForm (): JSX.Element {
    return <form onSubmit={this.onSubmit}>
      <TextField
        label='Base path'
        name='basePath'
        value={this.state.basePath}
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
      >
        Login
      </Button>
    </form>
  }

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
    this.props.onSave(this.state)
  }
}

export default withStyles(styles)(LoginForm)
