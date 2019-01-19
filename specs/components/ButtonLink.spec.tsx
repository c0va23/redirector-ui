import { mount } from 'enzyme'
import * as React from 'react'
import * as ReactRouterDom from 'react-router-dom'

import ButtonLink from '../../src/components/ButtonLink'

describe('ButtonLink', () => {
  describe('button with link and text', () => {
    let buttonLink = mount(
      <ReactRouterDom.MemoryRouter>
        <ReactRouterDom.Switch>
          <ReactRouterDom.Route>
            <ButtonLink to='/test'>
              Test
            </ButtonLink>
          </ReactRouterDom.Route>
        </ReactRouterDom.Switch>
      </ReactRouterDom.MemoryRouter>)

    it('render link', () => {
      expect(buttonLink.find('a[href="/test"]')).toHaveLength(1)
    })

    it('render button with text', () => {
      expect(buttonLink.text()).toEqual('Test')
    })
  })

  describe('button with custom class', () => {
    let buttonLink = mount(
      <ReactRouterDom.MemoryRouter>
        <ButtonLink to='/test' className='test-class'>
          Test
        </ButtonLink>
      </ReactRouterDom.MemoryRouter>)

    it('render button with class', () => {
      expect(buttonLink.find('a').hasClass('test-class')).toBeTruthy()
    })
  })
})
