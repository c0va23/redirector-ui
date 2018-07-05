import * as React from 'react'

import {
  ReactWrapper,
  mount,
} from 'enzyme'
import { internet } from 'faker'

import Config from '../../src/Config'
import LoginForm from '../../src/components/LoginForm'

describe('LoginForm', () => {
  let onSave: (config: Config) => void
  let loginForm: ReactWrapper

  beforeEach(() => {
    onSave = jest.fn()
    loginForm = mount(<LoginForm onSave={onSave} />)
  })

  describe('fields', () => {
    it('have basePath field', () => {
      let basePathField = loginForm.find('[name="basePath"]').first()

      expect(basePathField.prop('label')).toEqual('Base path')
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
    const basePath = 'http://localhost:12345/'

    beforeEach(() => {
      loginForm.find('input[name="basePath"]')
        .first()
        .simulate('change', { target: { value: basePath, name: 'basePath' } })

      loginForm.find('input[name="username"]')
        .first()
        .simulate('change', { target: { value: username, name: 'username' } })

      loginForm.find('input[name="password"]')
        .first()
        .simulate('change', { target: { value: password, name: 'password' } })
    })

    it('call onSave event with valid config', () => {
      loginForm.find('form').first().simulate('submit')
      expect(onSave).toBeCalledWith({
        username,
        password,
        basePath,
      })
    })
  })

  describe('with not undefined prop apiUri', () => {
    let apiUri: string

    beforeEach(() => {
      apiUri = internet.url()
      loginForm = mount(<LoginForm
        apiUri={apiUri}
        onSave={onSave}
      />)
    })

    it('field basePath have value form apiUri', () => {
      let basePathInput = loginForm.find('input[name="basePath"]').first()

      expect(basePathInput.prop('value')).toEqual(apiUri)
    })
  })
})
