import * as React from 'react'
import { CircularProgress } from '@material-ui/core'

import Loader from '../../src/components/Loader'

import { lorem } from 'faker'
import { ReactWrapper, mount } from 'enzyme'

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
