import { useEffect, useState } from 'react'
import { getConfiguredFormats } from '@/configured-format'
import { MultiOption, Option } from '@/options/MultiOption/MultiOption'
import { intl } from '@/intl'

import { ContentProps } from './interface'

// content components receive up-to-date opts and are responsible for reporting opts changes

export const Link = ({ opts, onChange }: ContentProps<'link'>) => {
  const [options, setOptions] = useState<Option[]>()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    getConfiguredFormats().then((formats) => {
      setOptions(
        formats
          .filter((format) => format.id !== 'link')
          .map(({ id, label }) => ({
            value: id,
            label,
          })),
      )
    })
  }, [])

  return options ? (
    <MultiOption
      autoFocus
      label={intl.plaintextFallback()}
      defaultValue={opts.plaintextFallback}
      options={options}
      onChange={(option) => {
        if (!option) return

        onChange({
          ...opts,
          plaintextFallback: option.value,
        })
      }}
      onKeyDown={(e) => {
        // allow Escape or Enter to close dropdown without closing dialog
        if (isMenuOpen) {
          e.stopPropagation()
        }
      }}
      onMenuClose={() => {
        setIsMenuOpen(false)
      }}
      onMenuOpen={() => {
        setIsMenuOpen(true)
      }}
    />
  ) : null
}
