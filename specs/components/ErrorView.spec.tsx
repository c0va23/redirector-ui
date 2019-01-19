import { Typography } from '@material-ui/core'
import { ReactWrapper, mount } from 'enzyme'
import { lorem } from 'faker'
import * as React from 'react'

import ErrorView from '../../src/components/ErrorView'

describe('ErrorView', () => {
  let errorView: ReactWrapper

  describe('on simple error', () => {
    let response: Error

    beforeEach(() => {
      response = new TypeError(lorem.sentence())

      errorView = mount(<ErrorView response={response} />)
    })

    it('render error name', () => {
      let headlineEl = errorView.find(Typography).filter({ id: 'errorName' })
      expect(headlineEl.text()).toEqual(response.name)
    })

    it('render error message', () => {
      let bodyMessageEl = errorView.find(Typography).filter({ id: 'errorMessage' })
      expect(bodyMessageEl.text()).toEqual(response.message)
    })
  })

  describe('on HTTP error', () => {
    let bodyText: string
    let status: number
    let statusText: string
    let response: Response
    let testFn: jest.SpyInstance

    beforeEach(() => {
      bodyText = lorem.sentence()
      status = 400 + Math.round(100 * Math.random())
      statusText = lorem.sentence(2)

      response = new Response(undefined, {
        status: status,
        statusText: statusText,
      })

      testFn = jest.spyOn(response, 'text')
    })

    describe('when response body read success', () => {
      beforeEach(() => {
        testFn.mockResolvedValue(bodyText)
        errorView = mount(<ErrorView response={response} />)
        return response.text()
          .then(() => errorView = errorView.update())
      })

      it('have name "HTTP code"', () => {
        let nameEl = errorView.find(Typography).filter({ id: 'errorName' })
        expect(nameEl.text()).toEqual('HTTP error')
      })

      it('have status message', () => {
        let messageEl = errorView.find(Typography).filter({ id: 'errorMessage' })
        expect(messageEl.text()).toEqual(`${status}: ${statusText}`)
      })

      it('have body text', () => {
        let bodyTextEl = errorView.find(Typography).filter({ id: 'bodyText' })
        expect(bodyTextEl.text()).toEqual(bodyText)
      })
    })

    describe('when response body read error', () => {
      let readErrorMessage: string
      beforeEach(() => {
        readErrorMessage = lorem.sentence()
        testFn.mockRejectedValue(new Error(readErrorMessage))

        errorView = mount(<ErrorView response={response} />)

        return new Promise(setImmediate)
          .then(() => errorView = errorView.update())
      })

      it('render read error name', () => {
        let nameEl = errorView.find(Typography).filter({ id: 'errorName' })
        expect(nameEl.text()).toEqual('Error')
      })

      it('render read error message', () => {
        let messageEl = errorView.find(Typography).filter({ id: 'errorMessage' })
        expect(messageEl.text()).toEqual(readErrorMessage)
      })
    })
  })
})
