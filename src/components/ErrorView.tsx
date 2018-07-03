import * as React from 'react'

import {
  Grid,
  Typography,
} from '@material-ui/core'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'
import * as log from 'loglevel'

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

export interface ErrorViewProps {
  response: {
    status: number,
    statusText: string,
    text: () => Promise<string>,
  },
}

class State {
  bodyText?: string
}

class ErrorView extends React.PureComponent<ErrorViewProps & WithStyles, State> {
  state = new State()

  render () {
    return <Grid
      container
      justify='center'
      alignItems='center'
      className={this.props.classes.container}
    >
      <Grid
        item
        className={this.props.classes.item}
      >
        <Typography variant='headline'>
          Error
        </Typography>
        <Typography variant='subheading'>
          <span role='status'>{this.props.response.status}</span>:
          &nbsp;
          <span role='statusText'>{this.props.response.statusText}</span>
        </Typography>
        {this.state.bodyText !== undefined &&
          <Typography variant='body1' role='bodyText'>
            {this.state.bodyText}
          </Typography>}
      </Grid>
    </Grid>
  }

  componentDidMount () {
    this.props.response.text()
      .then(bodyText => this.setState({ bodyText }))
      .catch((error: Error) => {
        logger.error(error)
        this.setState({ bodyText: `${error.name}\n${error.message}` })
      })
  }
}

export default withStyles(styles)(ErrorView)
