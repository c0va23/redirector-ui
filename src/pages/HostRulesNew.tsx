import * as React from 'react'

import Paper from '@material-ui/core/Paper'
import { StyleRulesCallback, WithStyles, withStyles } from '@material-ui/core/styles'
import * as log from 'loglevel'
import {
  RouteComponentProps,
  withRouter,
} from 'react-router-dom'

import {
  ConfigApiInterface,
  HostRules,
} from 'redirector-client'

import ButtonLink from '../components/ButtonLink'
import HostRulesForm, {
  ErrorSaveCb,
  SuccessSaveCb,
} from '../forms/HostRulesForm'

const logger = log.getLogger('HostRulesNew')

const styles: StyleRulesCallback = (theme) => ({
  paper: {
    padding: theme.spacing.unit,
    margin: theme.spacing.unit * 2,
  },
  backButton: {
    margin: theme.spacing.unit * 2,
  },
})

interface Props {
  configApi: ConfigApiInterface,
}

class HostRulesNew extends React.Component<
  Props
  & RouteComponentProps<never>
  & WithStyles
  , HostRules
> {
  state = {
    host: '',
    defaultTarget: {
      path: '',
      httpCode: 301,
    },
    rules: [],
  }

  render () {
    return (
    <>
      <ButtonLink to='/host_rules_list' className={this.props.classes.backButton}>
        List
      </ButtonLink>

      <Paper className={this.props.classes.paper}>
        <HostRulesForm
          hostRules={this.state}
          onSave={this.onSave}
          onUpdateHostRules={this.updateHostRules}
        />
      </Paper>
    </>)
  }

  private onSave = (
    onSuccess: SuccessSaveCb,
    onError: ErrorSaveCb,
  ) =>
    this.props
      .configApi
      .createHostRules(this.state)
      .then(this.redirectToEditPage)
      .then(onSuccess)
      .catch((error) => {
        logger.error(error)
        onError(error)
      })

  private updateHostRules = (hostRules: HostRules) =>
    this.setState(hostRules)

  private redirectToEditPage = (hostRules: HostRules): void =>
      this.props
        .history
        .push(`/host_rules_list/${hostRules.host}/edit`)
}

const styledHostRulesNew = withStyles(styles)(HostRulesNew)
export default withRouter(styledHostRulesNew)
