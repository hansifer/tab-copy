import { intl } from '@/intl'

import { TextOption } from '@/options/TextOption/TextOption'

import { ContentProps } from './interface'

// content components receive up-to-date option and are responsible for reporting option changes

// todo: add validation

export const TitleUrl1Line = ({ option, onChange }: ContentProps<'titleUrl1Line'>) => {
  return (
    <TextOption
      label={intl.separator()}
      value={option.separator}
      width="60px"
      maxLength={6}
      autoFocus
      onChange={(separator) => {
        onChange({
          ...option,
          separator,
        })
      }}
    />
  )
}
