import * as React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import withStyles, {
  StyleRulesCallback,
  WithStyles,
} from '@material-ui/core/styles/withStyles'

interface LoaderProps {
  label: string
}

const styles: StyleRulesCallback = (_theme) => ({
  container: {
    flexGrow: 1,
  },
  item: {
    textAlign: 'center',
  },
})

class Loader extends React.PureComponent<LoaderProps & WithStyles> {
  render () {
    return (
      <Grid
        container
        justify='center'
        alignItems='center'
        alignContent='center'
        className={this.props.classes.container}
      >
        <Grid item className={this.props.classes.item}>
          <CircularProgress
            variant='indeterminate'
            size='60'
          />
          <Typography variant='headline'>
            {this.props.label}
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(Loader)
