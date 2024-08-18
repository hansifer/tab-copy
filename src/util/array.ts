export function unique<T>(items: T[]): T[] {
  return items.filter((item, i) => items.indexOf(item) === i)
}

export function addOrRemove<T>(items: T[], item: T): T[] {
  const exists = items.includes(item)

  return exists // wrap
    ? items.filter((i) => i !== item)
    : [...items, item]
}
