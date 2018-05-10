import * as React from "react"
import {
  Link,
  LinkProps,
} from "react-router-dom"
import * as History from "history"
import * as MaterialUI from "material-ui"

interface Props {
  to: History.LocationDescriptor,
}

export default class ButtonLink extends React.Component<Props> {
  render() {
    return <MaterialUI.Button component={Link} {...this.props as any}>
      {this.props.children}
    </MaterialUI.Button>
  }
}
