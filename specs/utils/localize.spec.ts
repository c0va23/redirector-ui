import { Translation } from 'redirector-client'

import {
  MaybyLocaleTranslations,
  buildLocalizer,
  localize,
} from '../../src/utils/localize'
import {
  randomLocaleTranslations,
  randomMessage,
  randomTranslationKey,
} from '../factories/LocaleTranslationsFactory'

describe('localize', () => {
  let key: string
  let localeTranslations: MaybyLocaleTranslations

  beforeEach(() => {
    key = randomTranslationKey()
  })

  describe('when localeTranslations undefined', () => {
    beforeEach(() => {
      localeTranslations = undefined
    })

    it('return key', () => {
      expect(localize(localeTranslations, key)).toEqual(key)
    })
  })

  describe('when localeTranslaion not have key', () => {
    beforeEach(() => {
      localeTranslations = randomLocaleTranslations('en', true, 0, 0)
    })

    it('return key', () => {
      expect(localize(localeTranslations, key)).toEqual(key)
    })
  })

  describe('when localeTranslation have key', () => {
    let message: string
    beforeEach(() => {
      message = randomMessage()
      localeTranslations = {
        code: 'en',
        translations: [{
          key: key,
          message: message,
        }],
        defaultLocale: false,
      }
    })

    it('return message', () => {
      expect(localize(localeTranslations, key)).toEqual(message)
    })
  })
})

describe('buildLocalizer', () => {
  let localeTranslaions: MaybyLocaleTranslations
  const localizer = () => buildLocalizer(localeTranslaions)

  describe('when locale translations not empty', () => {
    let randomTranslation: Translation

    beforeEach(() => {
      localeTranslaions = randomLocaleTranslations()

      let maxIndex = localeTranslaions.translations.length
      let index = Math.trunc(Math.random() * maxIndex)
      randomTranslation = localeTranslaions.translations[index]
    })

    it('return localize with locale translations', () => {
      expect(localizer()(randomTranslation.key)).toEqual(randomTranslation.message)
    })
  })
})
