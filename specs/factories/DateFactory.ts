const minUnixTime = 1_500_000_000_000 // 2017-07-14T02:40:00.000Z
const maxUnixTime = 3_000_000_000_000 // 2065-01-24T05:20:00.000Z
const minute = 60_000

export function randomUnixTime(min: number = minUnixTime, max: number = maxUnixTime): number {
  return min + Math.round((max - min) * Math.random() / minute) * minute
}

export function randomDate(
  min: Date = new Date(minUnixTime),
  max: Date = new Date(maxUnixTime),
): Date {
  let unixTime = randomUnixTime(min.getTime(), max.getTime())
  return new Date(unixTime)
}
