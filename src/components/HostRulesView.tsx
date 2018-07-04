import * as React from 'react'

import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

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
    <Toolbar>
      <Typography variant='headline' style={{ flex: 1 }}>
        {hostRules.host}
      </Typography>

      <Button name='delete' onClick={this.onDelete}>
        Delete
      </Button>
      <ButtonLink to={`/host_rules_list/${hostRules.host}/edit`}>
        Edit
      </ButtonLink>
    </Toolbar>

  private renderRules = (rules: Array<Rule>, defaultTarget: Target) =>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            Source
          </TableCell>
          <TableCell>
            Target (Code)
          </TableCell>
          <TableCell>
            Target (Path)
          </TableCell>
          <TableCell>
            Active from
          </TableCell>
          <TableCell>
            Active to
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rules.map((rule, index) =>
          <TableRow key={index}>
            <TableCell>{rule.sourcePath}</TableCell>
            <TableCell>{rule.target.httpCode}</TableCell>
            <TableCell>{rule.target.path}</TableCell>
            <TableCell>
              {rule.activeFrom && rule.activeFrom.toISOString()}
            </TableCell>
            <TableCell>
              {rule.activeTo && rule.activeTo.toISOString()}
            </TableCell>
          </TableRow>)}
        <TableRow title='Default target'>
          <TableCell>*</TableCell>
          <TableCell>{defaultTarget.httpCode}</TableCell>
          <TableCell>{defaultTarget.path}</TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      </TableBody>
    </Table>

  private onDelete = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.props.onDelete(this.props.hostRules.host)
  }
}
