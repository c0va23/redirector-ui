import { FormHelperText, FormLabel, Select } from '@material-ui/core'
import { mount } from 'enzyme'
import * as React from 'react'

import { StatusCodeSelect } from '../../src/components/StatusCodeSelect'

describe('StatusCodeSelect', () => {
  let error = false
  let onChange: jest.Mock
  let helperText: string | undefined

  const name = 'statusCode'
  const label = 'Status code'
  const value = 301

  let buildStatusCodeSelect = () => mount(
      <StatusCodeSelect
        label={label}
        name={name}
        value={value}
        error={error}
        onChange={onChange}
        helperText={helperText}
      />,
    )

  it('render label', () => {
    expect(buildStatusCodeSelect().find(FormLabel).text()).toEqual(label)
  })

  it('render select', () => {
    expect(buildStatusCodeSelect().find(Select).prop('value')).toEqual(value)
  })

  describe('onChange', () => {
    const newValue = 306

    beforeEach(() => {
      onChange = jest.fn()
      buildStatusCodeSelect().find(Select).prop('onChange')({
        target: {
          name: name,
          value: newValue.toString(),
        },
      })
    })

    it('call on change', () => {
      expect(onChange).toBeCalledWith({
        name: name,
        value: newValue,
      })
    })
  })

  describe('without textHelper', () => {
    beforeEach(() => {
      helperText = undefined
    })

    it('no show helper text', () => {
      expect(buildStatusCodeSelect().find(FormHelperText)).toHaveLength(0)
    })
  })

  describe('with textHelper', () => {
    beforeEach(() => {
      helperText = 'Error messag'
    })

    it('show helper text', () => {
      expect(buildStatusCodeSelect().find(FormHelperText).text()).toEqual(helperText)
    })

    describe('with error', () => {
      beforeEach(() => error = true)

      it('enable error on helperText', () => {
        expect(buildStatusCodeSelect().find(FormHelperText).prop('error')).toEqual(error)
      })
    })

    describe('without error', () => {
      beforeEach(() => error = false)

      it('disable error on helperText', () => {
        expect(buildStatusCodeSelect().find(FormHelperText).prop('error')).toEqual(error)
      })
    })
  })
})
