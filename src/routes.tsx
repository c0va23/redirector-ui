import * as React from 'react'
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { ConfigApiInterface } from 'redirector-client'

import Config from './Config'
import HostRulesEdit from './pages/HostRulesEdit'
import HostRulesList from './pages/HostRulesList'
import HostRulesNew from './pages/HostRulesNew'
import LoginForm from './pages/LoginForm'

const HOST_RULES_LIST_PATH = '/host_rules_list'
const HOST_RULES_EDIT_PATH = HOST_RULES_LIST_PATH + '/:host/edit'
const HOST_RULES_NEW_PATH = HOST_RULES_LIST_PATH + '/new'

export interface AuthorizedRoutesProps {
  configApi: ConfigApiInterface
}

export type AuthorizedRoutes =
  (props: AuthorizedRoutesProps) => JSX.Element

export const defaultAuthorizedRoutes: AuthorizedRoutes = ({
  configApi,
}) => (
  <Switch>
    <Route path={HOST_RULES_EDIT_PATH}>
      <HostRulesEdit {...{ configApi }} />
    </Route>

    <Route path={HOST_RULES_NEW_PATH}>
      <HostRulesNew {...{ configApi }} />
    </Route>

    <Route path={HOST_RULES_LIST_PATH}>
      <HostRulesList {...{ configApi }} />
    </Route>

    <Redirect
      exact
      to={HOST_RULES_LIST_PATH}
    />
  </Switch>
)

const LOGIN_PATH = '/login'

export interface UnauthorizedRoutesProps {
  logIn: (config: Config) => void
  apiUrl?: string
}
export type UnauthorizedRoutes =
  (props: UnauthorizedRoutesProps) => JSX.Element

export const defaultUnauthorizedRoutes: UnauthorizedRoutes = ({
  logIn,
  apiUrl,
}) => (
  <Switch>
    <Route path={LOGIN_PATH}>
      <LoginForm apiUrl={apiUrl} logIn={logIn} />
    </Route>

    <Redirect to={LOGIN_PATH} />
  </Switch>
)
