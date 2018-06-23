import * as Faker from 'faker'

export function randomPath (): string {
  return Faker.lorem.words().replace(/\s+/, '/')
}
