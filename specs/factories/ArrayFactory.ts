interface FactoryFn<T> {
  (): T
}

export function newArray<T>(factory: FactoryFn<T>, size: number): Array<T> {
  return Array(size).fill(null).map(factory)
}

export function randomArray<T>(factory: FactoryFn<T>, minSize, maxSize: number): Array<T> {
  let size = minSize + Math.round(Math.random() * (maxSize - minSize))
  return newArray(factory, size)
}
