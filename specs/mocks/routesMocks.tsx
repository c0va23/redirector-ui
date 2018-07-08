import * as React from 'react'

import {
  AuthorizedRoutes,
  AuthorizedRoutesProps,
  UnauthorizedRoutes,
  UnauthorizedRoutesProps,
} from '../../src/routes'

export class AuthorizedRoutesMock extends React.Component<AuthorizedRoutesProps> {
  render () {
    return JSON.stringify(this.props)
  }
}

export const mockedAuthorizedRoutes: AuthorizedRoutes =
  ({ configApi }) => <AuthorizedRoutesMock configApi={configApi} />

export class UnauthorizedRoutesMock extends React.Component<UnauthorizedRoutesProps> {
  render () {
    return JSON.stringify(this.props)
  }
}

export const mockedUnauthorizedRoutes: UnauthorizedRoutes =
  (props) => <UnauthorizedRoutesMock {...props} />
