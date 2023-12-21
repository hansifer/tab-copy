import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

import { ContentProps } from './interface'
import classes from './Custom.module.css'

// content components receive up-to-date option and are responsible for reporting option changes

// todo: add template fields
// todo: add validation

export const Custom = ({ option, onChange }: ContentProps<'custom-*'>) => {
  return (
    <div className={classes.name}>
      <div>{sentenceCase(intl.name())}:</div>
      <input
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
  )
}
