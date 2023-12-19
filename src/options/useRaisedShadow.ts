import { useEffect } from 'react'
import { animate, MotionValue, useMotionValue } from 'framer-motion'

const inactiveShadow = '0 0 0 rgba(0,0,0,0.8)'

export function useRaisedShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow)

  useEffect(() => {
    let isActive = false

    value.on('change', (latest) => {
      const wasActive = isActive

      if (latest !== 0) {
        isActive = true

        if (isActive !== wasActive) {
          animate(boxShadow, '0 10px 10px rgba(0,0,0,0.4)')
        }
      } else {
        isActive = false

        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow)
        }
      }
    })
  }, [value, boxShadow])

  return boxShadow
}
