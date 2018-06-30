import { lorem } from 'faker'

const minStatusCode = 200
const maxStatusCode = 599

export function randomStatusCode (
  fromCode: number = minStatusCode,
  toCode: number = maxStatusCode,
): number {
  let range = toCode - fromCode
  return fromCode + Math.round(range * Math.random())
}

export function randomStatusText (): string {
  return lorem.sentence(2)
}

export function randomResponse (
  fromCode: number = minStatusCode,
  toCode: number = maxStatusCode,
): Response {
  let statusText = randomStatusText()
  let statusCode = randomStatusCode(fromCode, toCode)
  let json = JSON.stringify({
    code: statusCode,
    message: statusText,
  })

  return new Response(json, {
    status: statusCode,
    statusText: statusText,
  })
}
