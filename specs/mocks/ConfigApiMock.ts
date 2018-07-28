import { ConfigApiInterface } from 'redirector-client'

export class ConfigApiMock implements ConfigApiInterface {
  createHostRulesMock = jest.fn()
  deleteHostRulesMock = jest.fn()
  getHostRuleMock = jest.fn()
  listHostRulesMock = jest.fn()
  updateHostRulesMock = jest.fn()
  localesMock = jest.fn()

  createHostRules = this.createHostRulesMock
  deleteHostRules = this.deleteHostRulesMock
  getHostRule = this.getHostRuleMock
  listHostRules = this.listHostRulesMock
  updateHostRules = this.updateHostRulesMock
  locales = this.localesMock
}
