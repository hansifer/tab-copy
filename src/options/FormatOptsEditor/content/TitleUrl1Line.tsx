import { intl } from '@/intl'

import { TextOption } from '@/options/TextOption/TextOption'

import { ContentProps } from './interface'

// content components receive up-to-date opts and are responsible for reporting opts changes

// todo: add validation

export const TitleUrl1Line = ({ opts, onChange }: ContentProps<'titleUrl1Line'>) => {
  return (
    <TextOption
      label={intl.separator()}
      value={opts.separator}
      width="60px"
      maxLength={6}
      autoFocus
      onChange={(separator) => {
        onChange({
          ...opts,
          separator,
        })
      }}
    />
  )
}
