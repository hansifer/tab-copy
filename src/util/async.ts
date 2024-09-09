// provide a promise that can be manually resolved
export function promiseTrigger<T extends unknown = void>() {
  let trigger: (value: T) => void

  const state = {
    resolved: false,
  }

  const promise = new Promise<T>((resolve) => {
    trigger = (value) => {
      state.resolved = true
      resolve(value)
    }
  })

  return {
    promise,
    // @ts-ignore // "Variable 'trigger' is used before being assigned" is technically a false TS error because the Promise executor function runs synchronously
    trigger,
    state,
  }
}

export function wait<T>(fct?: (() => T | void) | number, ms = 0): Promise<T | void> {
  if (typeof fct === 'number') {
    ms = fct
    fct = undefined
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve((fct as Exclude<typeof fct, number>)?.())
    }, ms)
  })
}
