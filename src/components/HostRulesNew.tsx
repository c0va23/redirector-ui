import * as React from 'react'
import {
  withRouter,
  RouteComponentProps,
} from 'react-router-dom'
import * as MaterialUI from '@material-ui/core'
import * as Styles from '@material-ui/core/styles'
import * as log from 'loglevel'

import {
  HostRules,
  ConfigApiInterface,
} from 'redirector-client'

import HostRulesForm, {
  SuccessSaveCb,
  ErrorSaveCb,
} from './HostRulesForm'
import ButtonLink from './ButtonLink'

const logger = log.getLogger('HostRulesNew')

const styles: Styles.StyleRulesCallback = (theme) => ({
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
  & Styles.WithStyles
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
    return <div>
      <ButtonLink to='/host_rules_list' className={this.props.classes.backButton}>
        List
      </ButtonLink>

      <MaterialUI.Paper className={this.props.classes.paper}>
        <HostRulesForm
          hostRules={this.state}
          onSave={this.onSave}
          onHostRulesChanged={this.setState.bind(this)}
        />
      </MaterialUI.Paper>
    </div>
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

  private redirectToEditPage = (hostRules: HostRules): void =>
      this.props
        .history
        .push(`/host_rules_list/${hostRules.host}/edit`)
}

const styledHostRulesNew = MaterialUI.withStyles(styles)(HostRulesNew)
export default withRouter(styledHostRulesNew)
