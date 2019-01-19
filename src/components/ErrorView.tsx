import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'
import * as log from 'loglevel'
import * as React from 'react'

const logger = log.getLogger('ErrorView')

const styles: StyleRulesCallback = (theme) => ({
  container: {
    flexGrow: 1,
    height: '100%',
  },
  item: {
    borderStyle: 'solid',
    borderColor: theme.palette.error.light,
    padding: theme.spacing.unit * 2,
  },
})

type ErrorType = Response | Error

export interface ErrorViewProps {
  response: ErrorType,
}

class State {
  bodyText?: string
  constructor (
    readonly error: ErrorType,
  ) {}
}

class ErrorView extends React.PureComponent<
  ErrorViewProps
  & WithStyles
  , State
> {
  state = new State(this.props.response)

  render () {
    return (
      <Grid
        container
        justify='center'
        alignItems='center'
        className={this.props.classes.container}
      >
        <Grid
          item
          className={this.props.classes.item}
        >
          <Typography variant='headline' id='errorName'>
            {this.formatedName()}
          </Typography>

          <Typography
            variant='subheading'
            id='errorMessage'
          >
            {this.formattedMessage()}
          </Typography>

          {this.bodyText()}
        </Grid>
      </Grid>
    )
  }

  componentDidMount () {
    if (this.props.response instanceof Response) {
      this.fetchResponseText(this.props.response)
    }
  }

  private formatedName = (): string => {
    let error = this.state.error
    if (error instanceof Response) {
      return 'HTTP error'
    } else {
      return error.name
    }
  }

  private formattedMessage = () => {
    let error = this.state.error
    if (error instanceof Response) {
      return `${error.status}: ${error.statusText}`
    } else {
      return error.message
    }
  }

  private fetchResponseText (response: Response) {
    response.text()
      .then(bodyText => this.setState({ bodyText }))
      .catch((error: Error) => {
        logger.error(error)
        this.setState({ error })
      })
  }

  private bodyText () {
    if (undefined === this.state.bodyText) return undefined
    return (
      <Typography variant='body1' id='bodyText'>
        {this.state.bodyText}
      </Typography>
    )
  }
}

export default withStyles(styles)(ErrorView)
