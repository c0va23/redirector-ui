import { HostRules } from "../../gen/api-client";
import { newTarget, randomTarget } from "./TargetFactory";

import * as Faker from 'faker'
import { randomRule } from "./RuleFactory";
import { randomArray } from "./ArrayFactory";

export function newHostRules(): HostRules {
  return {
    host: '',
    defaultTarget: newTarget(),
    rules: [],
  }
}

export function randomHostRules(): HostRules {
  return {
    host: Faker.internet.domainName(),
    defaultTarget: randomTarget(),
    rules: randomArray(randomRule, 1, 5)
  }
}
