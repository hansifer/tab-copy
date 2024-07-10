import { useEffect, useRef } from 'react'

import { sentenceCase } from '@/util/string'
import classes from './TextOption.module.css'

// todo: add validation feature

type TextOptionProps = {
  label: string
  value: string
  width?: string
  maxLength?: number
  autoFocus?: boolean
  onChange: (value: string) => void
}

export const TextOption = ({
  // wrap
  label,
  value,
  width = '100%',
  maxLength,
  autoFocus,
  onChange,
}: TextOptionProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  return (
    <div className={classes.TextOption}>
      <div className={classes.label}>{sentenceCase(label)}</div>
      <div style={{ width }}>
        <input
          ref={inputRef}
          type="text"
          maxLength={maxLength}
          onInput={({ currentTarget }) => {
            onChange(currentTarget.value)
          }}
          value={value}
        />
      </div>
    </div>
  )
}
