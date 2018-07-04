const DATE_TO_UNIX_OFFSET = 60000

const TRIM_REGEXP = /:\d+\.\d+Z$/

export default function (date: Date): string {
  let unixOffset = date.getTimezoneOffset() * DATE_TO_UNIX_OFFSET
  let localeDate = new Date(date.getTime() - unixOffset)
  return localeDate.toISOString().replace(TRIM_REGEXP, '')
}
