import * as React from 'react'

import * as MaterialUI from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import {
  Link,
  LinkProps,
} from 'react-router-dom'

type Props = LinkProps & ButtonProps

export default class ButtonLink extends React.Component<Props> {
  render () {
    return <MaterialUI.Button component={Link} {...this.props as any}>
      {this.props.children}
    </MaterialUI.Button>
  }
}
