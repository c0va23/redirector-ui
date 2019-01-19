type HttpSatusCode = {
  code: number,
  message: String,
}

export const HTTP_STATUS_CODES: Array<HttpSatusCode> = [
  { code: 300, message: 'Multiple Choices' },
  { code: 301, message: 'Moved Permanently' },
  { code: 302, message: 'Moved Temporarily / Found' },
  { code: 303, message: 'See Other' },
  { code: 304, message: 'Not Modified' },
  { code: 305, message: 'Use Proxy' },
  { code: 307, message: 'Temporary Redirect' },
  { code: 308, message: 'Permanent Redirect' },
]
