import {
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
} from '@material-ui/core'
import { SnackbarProps } from '@material-ui/core/Snackbar'
import {
  ReactWrapper,
  mount,
} from 'enzyme'
import { lorem } from 'faker'
import * as React from 'react'
import { HostRules, ModelValidationError } from 'redirector-client'

import HostRulesForm from '../../src/forms/HostRulesForm'
import HostRulesFormWrapper, {
  HostRulesFormWrapperProps,
} from '../../src/forms/HostRulesFormWrapper'
import { randomHostRules } from '../factories/HostRulesFactory'

describe('HostRulesFormWrapper', () => {
  let hostRules: HostRules
  let saveCb: jest.Mock
  let updateCb: jest.Mock
  let hostRulesFormWrapper: ReactWrapper<HostRulesFormWrapperProps>
  let saveButton = () =>
    hostRulesFormWrapper.find(Button).filter({ name: 'save' }).first()
  let saveLoader = () =>
    hostRulesFormWrapper.find(CircularProgress).filter({ id: 'saveLoader' })

  beforeEach(() => {
    saveCb = jest.fn()
    updateCb = jest.fn()
    hostRules = randomHostRules()

    hostRulesFormWrapper =
      mount(
        <HostRulesFormWrapper
          hostRules={hostRules}
          onSaveHostRules={saveCb}
          onUpdateHostRules={updateCb}
        />,
      )
  })

  it('have not disable save button', () => {
    expect(saveButton().prop('disabled')).toBeFalsy()
  })

  it('not have save loader', () => {
    expect(saveLoader()).toHaveLength(0)
  })

  describe('click Save button', () => {
    beforeEach(() => {
      hostRulesFormWrapper
        .find(Button)
        .filter({ type: 'submit' })
        .first()
        .simulate('submit')
      hostRulesFormWrapper = hostRulesFormWrapper.update()
    })

    it('call save callback', () => {
      expect(saveCb).toBeCalled()
    })

    it('disable save button', () => {
      expect(saveButton().prop('disabled')).toBeTruthy()
    })

    it('show save loader', () => {
      expect(saveLoader()).toHaveLength(1)
    })

    describe('on success callback', () => {
      let snackbar: ReactWrapper
      beforeEach(() => {
        let [ onSuccess ] = saveCb.mock.calls[0]
        onSuccess()
        hostRulesFormWrapper = hostRulesFormWrapper.update()
        snackbar = hostRulesFormWrapper
          .find(Snackbar)
          .first()
      })

      it('show success message', () => {
        expect(snackbar.first().text()).toMatch(/Success/)
      })

      it('open snackbar', () => {
        expect(snackbar.prop('open')).toBeTruthy()
      })

      it('hide save loader', () => {
        expect(saveLoader()).toHaveLength(0)
      })
    })

    describe('on error callback with model error', () => {
      let modelError: ModelValidationError = [
        {
          name: 'host',
          errors: [
            { translationKey: 'error1' },
            { translationKey: 'error2' },
          ],
        },
      ]

      beforeEach(() => {
        let [ , onError ] = saveCb.mock.calls[0]
        let response = {
          status: 422,
          json: jest.fn().mockResolvedValue(modelError),
        }
        return onError(response).then(() => {
          hostRulesFormWrapper = hostRulesFormWrapper.update()
        })
      })

      it('set model error to host rules form', () => {
        expect(hostRulesFormWrapper.find(HostRulesForm).prop('modelError')).toEqual(modelError)
      })
    })

    describe('on error callback with model error', () => {
      let reason: string
      let snackbar: ReactWrapper<SnackbarProps>

      beforeEach(() => {
        let [ , onError ] = saveCb.mock.calls[0]
        reason = lorem.word()
        let response = {
          status: 422,
          json: jest.fn().mockRejectedValue({ reason }),
        }
        return onError(response).then(() => {
          hostRulesFormWrapper = hostRulesFormWrapper.update()
          snackbar = hostRulesFormWrapper.find(Snackbar).first()
        })
      })

      it('set message on snackbar', () => {
        expect(snackbar.text()).toMatch(reason)
      })

      it('show snackbar', () => {
        expect(snackbar.prop('open')).toBeTruthy()
      })
    })

    describe('on error callback with message', () => {
      let errorMessage = 'error message'
      let snackbar: ReactWrapper

      beforeEach(() => {
        let [ , onError ] = saveCb.mock.calls[0]
        let response = { status: 400, text: jest.fn().mockResolvedValue(errorMessage) }
        return onError(response).then(() => {
          snackbar = hostRulesFormWrapper
            .update()
            .find(Snackbar)
            .first()
        })
      })

      it('show error message', () => {
        expect(snackbar.text()).toEqual(expect.stringContaining(errorMessage))
      })

      it('open snackbar', () => {
        expect(snackbar.prop('open')).toBeTruthy()
      })

      describe('close snackbar', () => {
        beforeEach(() => {
          snackbar
            .find(IconButton)
            .first()
            .simulate('click')
          snackbar = hostRulesFormWrapper
            .find(Snackbar)
            .first()
        })

        it('close snackbar', () => {
          expect(snackbar.prop('open')).toBeFalsy()
        })
      })
    })
  })
})
