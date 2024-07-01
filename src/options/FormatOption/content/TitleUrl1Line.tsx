import { useEffect, useRef } from 'react'

import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

import { ContentProps } from './interface'
import classes from './TitleUrl1Line.module.css'

// content components receive up-to-date option and are responsible for reporting option changes

// todo: add validation

export const TitleUrl1Line = ({ option, onChange }: ContentProps<'titleUrl1Line'>) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className={classes.separator}>
      <div>{sentenceCase(intl.separator())}:</div>
      <input
        ref={inputRef}
        type="text"
        maxLength={6}
        onInput={({ currentTarget }) => {
          onChange({
            ...option,
            separator: currentTarget.value,
          })
        }}
        value={option.separator}
      />
    </div>
  )
}
