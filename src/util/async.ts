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

// returns a queue function that can be called to queue up async function calls. queued functions are called serially. if any queued function call rejects, all subsequent currently-queued calls reject also. each queued call receives the resolved value of the previous queued call (or undefined for first enqueued calls). use serialize call with promise chaining (`serialize(queuedCall).then().catch()`) instead of await unless you want to wait for the queue to be exhausted.
export function serializer() {
  let prevPromise: Promise<any>
  let callCount = 0

  return <T extends any>(queuedCall: (lastReturnValue: T) => Promise<T>): Promise<T> => {
    if (!callCount) prevPromise = Promise.resolve() // queue is empty

    callCount++

    return (prevPromise = prevPromise.then(queuedCall).finally(() => {
      callCount--
    }))
  }
}
