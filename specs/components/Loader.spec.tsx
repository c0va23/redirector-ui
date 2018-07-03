import * as React from 'react'

import {
  ReactWrapper,
  mount,
} from 'enzyme'
import { lorem } from 'faker'

import { CircularProgress } from '@material-ui/core'

import Loader from '../../src/components/Loader'

describe('Loader', () => {
  let label: string
  let loader: ReactWrapper

  beforeEach(() => {
    label = lorem.sentence()
    loader = mount(<Loader label={label} />)
  })

  it('render circular progress', () => {
    let circularProgress = loader.find(CircularProgress).first()
    expect(circularProgress.prop('variant')).toEqual('indeterminate')
  })

  it('have label', () => {
    expect(loader.text()).toEqual(label)
  })
})
