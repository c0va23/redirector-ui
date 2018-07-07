import * as React from 'react'

import {
  ReactWrapper,
  mount,
} from 'enzyme'

import { Target } from 'redirector-client'

import TargetForm, {
  UpdateTarget,
} from '../../src/components/TargetForm'

import { randomPath } from '../factories/PathFactory'
import {
  randomHttpCode,
  randomTarget,
} from '../factories/TargetFactory'

describe('TargetForm', () => {
  let target: Target
  let targetForm: ReactWrapper
  let updateTargetCb: UpdateTarget

  beforeEach(() => {
    target = randomTarget()
    updateTargetCb = jest.fn()
    targetForm = mount(<TargetForm
      target={target}
      onUpdateTarget={updateTargetCb}
    />)
  })

  describe('field httpCode', () => {
    let httpCodeField: ReactWrapper

    beforeEach(() => {
      httpCodeField = targetForm.find('TextField[name="httpCode"]').first()
    })

    it('have label', () => {
      expect(httpCodeField.prop('label')).toEqual('HTTP Code')
    })

    it('have value', () => {
      expect(httpCodeField.prop('value')).toEqual(target.httpCode)
    })

    it('have type number', () => {
      expect(httpCodeField.prop('type')).toEqual('number')
    })

    describe('change event', () => {
      let newHttpCode: number

      beforeEach(() => {
        newHttpCode = randomHttpCode()
        httpCodeField.find('input')
          .simulate('change', {
            target: {
              name: 'httpCode',
              value: newHttpCode,
            },
          })
      })

      it('call update target callback', () => {
        expect(updateTargetCb).toBeCalledWith({
          ...target,
          httpCode: newHttpCode,
        })
      })
    })
  })

  describe('field path', () => {
    let pathField: ReactWrapper

    beforeEach(() => {
      pathField = targetForm.find('TextField[name="path"]')
    })

    it('have label', () => {
      expect(pathField.prop('label')).toEqual('Path')
    })

    it('have value', () => {
      expect(pathField.prop('value')).toEqual(target.path)
    })

    describe('change event', () => {
      let newPath: string

      beforeEach(() => {
        newPath = randomPath()
        pathField
          .find('input')
          .simulate('change', {
            target: {
              name: 'path',
              value: newPath,
            },
          })
      })

      it('call update target callback', () => {
        expect(updateTargetCb).toBeCalledWith({
          ...target,
          path: newPath,
        })
      })
    })
  })
})
