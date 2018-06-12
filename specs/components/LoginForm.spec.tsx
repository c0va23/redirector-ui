import * as React from 'react'

import Config from '../../src/Config'
import LoginForm from '../../src/components/LoginForm'

import { mount } from 'enzyme'

describe('LoginForm', () => {
  describe('fields', () => {
    let onSave = (config: Config) => {}
    let loginForm = mount(
      <LoginForm onSave={onSave} />,
    )

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

    let onSave = jest.fn()
    let loginForm = mount(<LoginForm onSave={onSave} />)

    loginForm.find('input[name="basePath"]')
      .first()
      .simulate('change', { target: { value: basePath, name: 'basePath' } })

    loginForm.find('input[name="username"]')
      .first()
      .simulate('change', { target: { value: username, name: 'username' } })

    loginForm.find('input[name="password"]')
      .first()
      .simulate('change', { target: { value: password, name: 'password' } })

    it('call onSave event with valid config', () => {
      loginForm.find('form').first().simulate('submit')
      expect(onSave).toBeCalledWith({
        username,
        password,
        basePath,
      })
    })
  })
})
