import * as React from 'react'

import {
  ReactWrapper,
  mount,
} from 'enzyme'
import { internet } from 'faker'

import LoginForm, {
  LogIn,
} from '../../src/components/LoginForm'

describe('LoginForm', () => {
  let logIn: LogIn
  let loginForm: ReactWrapper

  beforeEach(() => {
    logIn = jest.fn()
    loginForm = mount(<LoginForm logIn={logIn} />)
  })

  describe('fields', () => {
    it('have apiUrl field', () => {
      let basePathField = loginForm.find('[name="apiUrl"]').first()

      expect(basePathField.prop('label')).toEqual('API URL')
    })

    it('have username field', () => {
      let usernameField = loginForm.find('[name="username"]').first()

      expect(usernameField.prop('label')).toEqual('Username')
    })

    it('have password field', () => {
      let passwordField = loginForm.find('[name="password"]').first()

      expect(passwordField.prop('label')).toEqual('Password')
      expect(passwordField.prop('type')).toEqual('password')
    })

    it('Have submit button', () => {
      let submitButton = loginForm.find('button[type="submit"]')

      expect(submitButton.text()).toEqual('Login')
    })
  })

  describe('onSave event', () => {
    const username = 'user'
    const password = 'pass'
    const apiUrl = 'http://localhost:12345/'

    beforeEach(() => {
      loginForm.find('input[name="apiUrl"]')
        .first()
        .simulate('change', { target: { value: apiUrl, name: 'apiUrl' } })

      loginForm.find('input[name="username"]')
        .first()
        .simulate('change', { target: { value: username, name: 'username' } })

      loginForm.find('input[name="password"]')
        .first()
        .simulate('change', { target: { value: password, name: 'password' } })
    })

    it('call onSave event with valid config', () => {
      loginForm.find('form').first().simulate('submit')
      expect(logIn).toBeCalledWith({
        username,
        password,
        apiUrl,
      })
    })
  })

  describe('with not undefined prop apiUrl', () => {
    let apiUrl: string

    beforeEach(() => {
      apiUrl = internet.url()
      loginForm = mount(<LoginForm
        apiUrl={apiUrl}
        logIn={logIn}
      />)
    })

    it('field basePath have value form apiUrl', () => {
      let basePathInput = loginForm.find('input[name="apiUrl"]').first()

      expect(basePathInput.prop('value')).toEqual(apiUrl)
    })
  })
})
