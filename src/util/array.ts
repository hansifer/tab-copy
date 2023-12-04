export function unique<T>(items: T[]): T[] {
  return items.filter((item, i) => items.indexOf(item) === i)
}
