import { Rule } from 'redirector-client'

import { randomDate } from './DateFactory'
import { randomPath } from './PathFactory'
import { randomTarget } from './TargetFactory'

export function newRule (): Rule {
  return {
    resolver: Rule.ResolverEnum.Simple,
    sourcePath: '',
    target: {
      httpCode: 301,
      path: '',
    },
  }
}

const allResolver = [
  Rule.ResolverEnum.Simple,
  Rule.ResolverEnum.Pattern,
]

export function randomResolver (): Rule.ResolverEnum {
  let index = Math.round(Math.random() * (allResolver.length - 1))
  return allResolver[index]
}

export function randomRule (): Rule {
  return {
    resolver: randomResolver(),
    sourcePath: randomPath(),
    target: randomTarget(),
    activeFrom: randomDate(),
    activeTo: randomDate(),
  }
}
