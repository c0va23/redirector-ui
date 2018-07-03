import * as Faker from 'faker'

import { HostRules } from 'redirector-client'

import { randomArray } from './ArrayFactory'
import { randomRule } from './RuleFactory'
import { newTarget, randomTarget } from './TargetFactory'

export function newHostRules (): HostRules {
  return {
    host: '',
    defaultTarget: newTarget(),
    rules: [],
  }
}

export function randomHostRules (): HostRules {
  return {
    host: Faker.internet.domainName(),
    defaultTarget: randomTarget(),
    rules: randomArray(randomRule, 1, 5),
  }
}
