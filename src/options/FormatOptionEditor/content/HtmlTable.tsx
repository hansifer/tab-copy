import { Checkbox } from '../../Checkbox/Checkbox'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

import { ContentProps } from './interface'

// content components receive up-to-date option and are responsible for reporting option changes

export const HtmlTable = ({ option, onChange }: ContentProps<'htmlTable'>) => {
  return (
    <Checkbox
      label={sentenceCase(intl.includeHeader())}
      checked={option.includeHeader}
      onClick={() => {
        onChange({
          ...option,
          includeHeader: !option.includeHeader,
        })
      }}
    />
  )
}
