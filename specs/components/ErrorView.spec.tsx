import * as React from 'react'

import { ReactWrapper, mount } from 'enzyme'
import { lorem } from 'faker'

import ErrorView from '../../src/components/ErrorView'

describe('ErrorView', () => {
  let bodyText: string
  let status: number
  let statusText: string
  let response: {
    status: number,
    statusText: string,
    text: jest.Mock,
  }
  let errorView: ReactWrapper

  beforeEach(() => {
    bodyText = lorem.sentence()
    status = 400 + Math.round(100 * Math.random())
    statusText = lorem.sentence(2)

    response = {
      status: status,
      statusText: statusText,
      text: jest.fn(),
    }
  })

  describe('when response body read success', () => {
    beforeEach(() => {
      response.text.mockResolvedValue(bodyText)
      errorView = mount(<ErrorView response={response} />)
      return response.text()
        .then(() => errorView = errorView.update())
    })

    it('have status code', () => {
      let statusEl = errorView.find('[role="status"]').first()
      expect(statusEl.text()).toEqual(status.toString())
    })

    it('have status text', () => {
      let statusTextEl = errorView.find('[role="statusText"]').first()
      expect(statusTextEl.text()).toEqual(statusText)
    })

    it('have body text', () => {
      let bodyTextEl = errorView.find('[role="bodyText"]').first()

      expect(bodyTextEl.text()).toEqual(bodyText)
    })
  })

  describe('when response body read success', () => {
    let readErrorMessage: string
    beforeEach(() => {
      readErrorMessage = lorem.sentence()
      response.text.mockRejectedValue(new Error(readErrorMessage))

      errorView = mount(<ErrorView response={response} />)

      return new Promise(setImmediate)
        .then(() => errorView = errorView.update())
    })

    it('render read error', () => {
      let bodyTextEl = errorView.find('[role="bodyText"]').first()

      expect(bodyTextEl.text()).toEqual(`Error\n${readErrorMessage}`)
    })
  })
})
