import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

import { Checkbox } from '@/options/Checkbox/Checkbox'

import { ContentProps } from './interface'

// content components receive up-to-date opts and are responsible for reporting opts changes

export const HtmlTable = ({ opts, onChange }: ContentProps<'htmlTable'>) => {
  return (
    <Checkbox
      label={sentenceCase(intl.includeHeader())}
      checked={opts.includeHeader}
      onClick={() => {
        onChange({
          ...opts,
          includeHeader: !opts.includeHeader,
        })
      }}
    />
  )
}
