import * as React from 'react'
import * as MaterialUI from '@material-ui/core'

import {
  HostRules,
  Rule,
  Target,
} from 'redirector-client'

import ButtonLink from './ButtonLink'

export type OnDeleteHostRules = (host: string) => void

export interface HostRulesViewProps {
  hostRules: HostRules,
  onDelete: OnDeleteHostRules,
}

export default class HostRulesView extends React.Component<HostRulesViewProps> {
  render () {
    return <div>
      {this.renderHostRules(this.props.hostRules)}
      {this.renderRules(this.props.hostRules.rules,
                        this.props.hostRules.defaultTarget)}
    </div>
  }

  private renderHostRules = (hostRules: HostRules) =>
    <MaterialUI.Toolbar>
      <MaterialUI.Typography variant='headline' style={{ flex: 1 }}>
        {hostRules.host}
      </MaterialUI.Typography>

      <MaterialUI.Button name='delete' onClick={this.onDelete}>
        Delete
      </MaterialUI.Button>
      <ButtonLink to={`/host_rules_list/${hostRules.host}/edit`}>
        Edit
      </ButtonLink>
    </MaterialUI.Toolbar>

  private renderRules = (rules: Array<Rule>, defaultTarget: Target) =>
    <MaterialUI.Table>
      <MaterialUI.TableHead>
        <MaterialUI.TableRow>
          <MaterialUI.TableCell>
            Source
          </MaterialUI.TableCell>
          <MaterialUI.TableCell>
            Target (Code)
          </MaterialUI.TableCell>
          <MaterialUI.TableCell>
            Target (Path)
          </MaterialUI.TableCell>
          <MaterialUI.TableCell>
            Active from
          </MaterialUI.TableCell>
          <MaterialUI.TableCell>
            Active to
          </MaterialUI.TableCell>
        </MaterialUI.TableRow>
      </MaterialUI.TableHead>
      <MaterialUI.TableBody>
        {rules.map((rule, index) =>
          <MaterialUI.TableRow key={index}>
            <MaterialUI.TableCell>{rule.sourcePath}</MaterialUI.TableCell>
            <MaterialUI.TableCell>{rule.target.httpCode}</MaterialUI.TableCell>
            <MaterialUI.TableCell>{rule.target.path}</MaterialUI.TableCell>
            <MaterialUI.TableCell>
              {rule.activeFrom && rule.activeFrom.toISOString()}
            </MaterialUI.TableCell>
            <MaterialUI.TableCell>
              {rule.activeTo && rule.activeTo.toISOString()}
            </MaterialUI.TableCell>
          </MaterialUI.TableRow>)}
        <MaterialUI.TableRow title='Default target'>
          <MaterialUI.TableCell>*</MaterialUI.TableCell>
          <MaterialUI.TableCell>{defaultTarget.httpCode}</MaterialUI.TableCell>
          <MaterialUI.TableCell>{defaultTarget.path}</MaterialUI.TableCell>
          <MaterialUI.TableCell />
          <MaterialUI.TableCell />
        </MaterialUI.TableRow>
      </MaterialUI.TableBody>
    </MaterialUI.Table>

  private onDelete = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.props.onDelete(this.props.hostRules.host)
  }
}
