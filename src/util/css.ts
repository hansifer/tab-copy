import { useState, useEffect } from 'react'
import isObject from 'lodash.isobject'

import { unique } from '@/util/array'

// compose a string of classnames suitable for className attribute
// if an item is an object, each of its keys is a className and its corresponding value an expression that, if truthy, causes the className to be included
// only supports string or object items for now
export function classy(...arr: any[]) {
  return unique(
    arr
      .map((item) =>
        isObject(item)
          ? Object.entries(item)
              .filter(([, include]) => include)
              .map(([className]) => className)
          : item,
      )
      .flat(),
  ).join(' ')
}

// theme

const prefersDarkMediaQuery = '(prefers-color-scheme: dark)'

export function prefersColorSchemeDark() {
  return !!window?.matchMedia?.(prefersDarkMediaQuery).matches
}

export const usePrefersColorSchemeDark = () => {
  const [prefersDark, setPrefersDark] = useState<boolean>(prefersColorSchemeDark)

  useEffect(() => {
    if (!window?.matchMedia) return

    const mediaQuery = window.matchMedia(prefersDarkMediaQuery)

    const handler = (e: MediaQueryListEvent) => {
      setPrefersDark(e.matches)
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [])

  return prefersDark
}
