import * as React from 'react'

import Button, { ButtonProps } from '@material-ui/core/Button'
import {
  Link,
  LinkProps,
} from 'react-router-dom'

type Props = LinkProps & ButtonProps

export default class ButtonLink extends React.Component<Props> {
  render () {
    return <Button component={Link} {...this.props as any}>
      {this.props.children}
    </Button>
  }
}
