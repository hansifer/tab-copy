import { TemplateFieldId, Token } from '@/template-field'
import { FormatOpts, CustomFormatId } from '@/format'

import { TextOption } from '@/options/TextOption/TextOption'

const TEMPLATE_FIELD_WIDTH = '265px'

type TemplateFieldProps = {
  id: TemplateFieldId
  label: string
  tokens: Token[]
  opts: FormatOpts[CustomFormatId]
  onChange: (opts: FormatOpts[CustomFormatId]) => void
}

export const TemplateField = ({
  // wrap
  id,
  label,
  tokens,
  opts,
  onChange,
}: TemplateFieldProps) => {
  return (
    <TextOption
      label={label}
      value={opts.template[id]}
      width={TEMPLATE_FIELD_WIDTH}
      tokens={tokens}
      onChange={(value) => {
        onChange({
          ...opts,
          template: {
            ...opts.template,
            [id]: value,
          },
        })
      }}
    />
  )
}
