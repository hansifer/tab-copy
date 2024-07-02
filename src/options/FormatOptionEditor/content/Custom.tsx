import { useEffect, useRef } from 'react'

import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'
import { classy } from '@/util/css'

import { ContentProps } from './interface'
import classes from './Custom.module.css'
import optionsClasses from '../../Options.module.css'

// content components receive up-to-date option and are responsible for reporting option changes

// todo: add template fields
// todo: add validation

export const Custom = ({ option, onChange, onConfirmDelete }: ContentProps<'custom-*'>) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className={classes.Custom}>
      <div className={classes.name}>
        <div>{sentenceCase(intl.name())}:</div>
        <input
          ref={inputRef}
          type="text"
          maxLength={30}
          onInput={({ currentTarget }) => {
            onChange({
              ...option,
              name: currentTarget.value,
            })
          }}
          value={option.name}
        />
      </div>
      {onConfirmDelete ? (
        <div>
          <button
            className={classy(optionsClasses.primaryAction, optionsClasses.destructiveAction)}
            onClick={() => onConfirmDelete()}
          >
            {sentenceCase(intl.deleteFormat())}
          </button>
        </div>
      ) : null}
    </div>
  )
}
