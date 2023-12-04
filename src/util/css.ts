import isObject from 'lodash.isobject'

import { unique } from '@/util/array'

// compose a string of classnames suitable for className attribute
// if an item is an object, each of its keys is a className and its corresponding value an expression that, if truthy, causes the className to be included
// only supports string or object items for now
export function classy(...arr: any[]) {
  return unique(
    arr
      .map((item) => {
        if (!isObject(item)) return item

        return Object.entries(item)
          .filter(([, include]) => include)
          .map(([className]) => className)
      })
      .flat(),
  ).join(' ')
}
