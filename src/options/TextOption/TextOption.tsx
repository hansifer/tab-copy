import { useState, useEffect, useRef } from 'react'

import { sentenceCase } from '@/util/string'
import classes from './TextOption.module.css'

// todo: add validation feature

const LEFT_ALIGN_THRESHOLD = 0.6

type TextOptionProps = {
  label: string
  value: string
  width?: number
  maxLength?: number
  autoFocus?: boolean
  onChange: (value: string) => void
}

export const TextOption = ({
  // wrap
  label,
  value,
  width,
  maxLength,
  autoFocus,
  onChange,
}: TextOptionProps) => {
  const [inputAlignLeft, setInputAlignLeft] = useState(false)

  const textOptionRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    setInputAlignLeft(
      !!(
        inputRef.current &&
        textOptionRef.current &&
        inputRef.current.offsetWidth / textOptionRef.current.offsetWidth < LEFT_ALIGN_THRESHOLD
      ),
    )
  }, [setInputAlignLeft, width]) // todo: using width in dep array to trigger effect on width change, against recommendations (avoid using dep array for control flow)

  return (
    <div
      ref={textOptionRef}
      className={classes.TextOption}
      style={{
        justifyContent: inputAlignLeft ? 'flex-start' : 'space-between',
      }}
    >
      <div className={classes.label}>{sentenceCase(label)}:</div>
      <input
        ref={inputRef}
        type="text"
        style={{ width: width ? `${width}px` : '80%' }}
        maxLength={maxLength}
        onInput={({ currentTarget }) => {
          onChange(currentTarget.value)
        }}
        value={value}
      />
    </div>
  )
}
