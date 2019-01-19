import {
  mount,
} from 'enzyme'
import * as React from 'react'
import {
  ModelValidationError,
  Target,
} from 'redirector-client'

import { StatusCodeSelect } from '../../src/components/StatusCodeSelect'
import TargetForm, {
  UpdateTarget,
} from '../../src/forms/TargetForm'
import { randomPath } from '../factories/PathFactory'
import {
  randomHttpCode,
  randomTarget,
} from '../factories/TargetFactory'

describe('TargetForm', () => {
  let target: Target
  let updateTargetCb: UpdateTarget
  let modelError: ModelValidationError

  let targetForm = () => mount(
    <TargetForm
      target={target}
      onUpdateTarget={updateTargetCb}
      modelError={modelError}
    />,
  )

  beforeEach(() => {
    target = randomTarget()
    updateTargetCb = jest.fn()
  })

  describe('field httpCode', () => {
    let httpCodeField = () =>
      targetForm().find(StatusCodeSelect).first()

    beforeEach(() => {
      modelError = []
    })

    it('have label', () => {
      expect(httpCodeField().prop('label')).toEqual('HTTP Code')
    })

    it('have value', () => {
      expect(httpCodeField().prop('value')).toEqual(target.httpCode)
    })

    it('not have error', () => {
      expect(httpCodeField().prop('error')).toEqual(false)
    })

    it('not show helper text', () => {
      expect(httpCodeField().prop('helperText')).toEqual('')
    })

    describe('change event', () => {
      let newHttpCode: number

      beforeEach(() => {
        newHttpCode = randomHttpCode()
        httpCodeField().prop('onChange')({
          name: 'httpCode',
          value: newHttpCode,
        })
      })

      it('call update target callback', () => {
        expect(updateTargetCb).toBeCalledWith({
          ...target,
          httpCode: newHttpCode,
        })
      })
    })

    describe('with errors', () => {
      beforeEach(() => {
        modelError = [{
          name: 'httpCode',
          errors: [
            { translationKey: 'error1' },
            { translationKey: 'error2' },
          ],
        }]
      })

      it('have error', () => {
        expect(httpCodeField().prop('error')).toEqual(true)
      })

      it('have errors into helper text', () => {
        expect(httpCodeField().prop('helperText')).toEqual('error1, error2')
      })
    })
  })

  describe('field path', () => {
    let pathField = () =>
      targetForm().find('TextField[name="path"]')

    beforeEach(() => {
      modelError = []
    })

    it('have label', () => {
      expect(pathField().prop('label')).toEqual('Path')
    })

    it('have value', () => {
      expect(pathField().prop('value')).toEqual(target.path)
    })

    describe('change event', () => {
      let newPath: string

      beforeEach(() => {
        newPath = randomPath()
        pathField()
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

    describe('with errors', () => {
      beforeEach(() => {
        modelError = [{
          name: 'path',
          errors: [
            { translationKey: 'error1' },
            { translationKey: 'error2' },
          ],
        }]
      })

      it('has error', () => {
        expect(pathField().prop('error')).toEqual(true)
      })

      it('has errors into helper text', () => {
        expect(pathField().prop('helperText')).toEqual('error1, error2')
      })
    })
  })
})
