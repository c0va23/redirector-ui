import {
  LocaleTranslations,
  Locales,
} from '../../gen/redirector-client'

export type MaybyLocaleTranslations = LocaleTranslations | undefined

export function localize (
  localeTranslations: MaybyLocaleTranslations,
  key: string,
): string {
  if (undefined === localeTranslations) {
    return key
  }

  let translation = localeTranslations.translations.find(_ => _.key === key)
  return undefined === translation ? key : translation.message
}

export type Localizer = (key: string) => string

export function buildLocalizer (
  localeTranslations: MaybyLocaleTranslations,
): Localizer {
  return (key: string): string =>
    localize(localeTranslations, key)
}

export function findLocaleTranslations (
  errorLocales: Locales,
): MaybyLocaleTranslations {
  return errorLocales.find(_ => _.defaultLocale)
}
