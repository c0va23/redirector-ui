import {
  lorem,
} from 'faker'

import {
  LocaleTranslations,
  Translation,
} from '../../gen/redirector-client'

import { randomArray } from './ArrayFactory'

export function randomTranslationKey (): string {
  return randomArray(lorem.word, 1, 3).join('.')
}

export const randomMessage = lorem.sentence

export function randomTranslation (): Translation {
  return {
    key: randomTranslationKey(),
    message: lorem.sentence(),
  }
}

export function randomLocaleTranslations (
  code: string = 'en',
  defaultLocale: boolean = true,
  minTranslations: number = 1,
  maxTranslations: number = 3,
): LocaleTranslations {
  return {
    code,
    defaultLocale,
    translations: randomArray(randomTranslation, minTranslations, maxTranslations),
  }
}
