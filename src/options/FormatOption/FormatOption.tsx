import { useState, useEffect, FC } from 'react'

import {
  isBuiltInFormatWithOptionId,
  BuiltInFormatWithOptionId,
  FormatWithOptionId,
  FormatOptions,
} from '@/format'
import { getConfiguredFormat, ConfiguredFormat } from '@/configured-format'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

import { ContentProps } from './content/interface'
import { HtmlTable } from './content/HtmlTable'
import { TitleUrl1Line } from './content/TitleUrl1Line'
import { Custom } from './content/Custom'

import classes from './FormatOption.module.css'
import optionsClasses from '../Options.module.css'

const builtInFormatOptionContent = {
  htmlTable: HtmlTable,
  titleUrl1Line: TitleUrl1Line,
} satisfies { [k in BuiltInFormatWithOptionId]: FC<ContentProps<k>> }

type FormatOptionProps<T extends FormatWithOptionId> = {
  formatId?: T
  onCancel?: () => void
  onOK?: (formatId: T, option: FormatOptions[T]) => void
}

export const FormatOption = <T extends FormatWithOptionId>({
  formatId,
  onCancel,
  onOK,
}: FormatOptionProps<T>) => {
  const [format, setFormat] = useState<ConfiguredFormat<T>>()

  useEffect(() => {
    if (formatId) {
      getConfiguredFormat(formatId).then(setFormat)
    } else {
      setFormat(undefined)
    }
  }, [formatId])

  if (!format) return null

  // todo: resolve need for TS assertion
  const Content = (isBuiltInFormatWithOptionId(format.id)
    ? builtInFormatOptionContent[format.id]
    : Custom) as unknown as FC<ContentProps<T>>

  return (
    <div
      className={classes.backdrop}
      onMouseDown={onCancel}
    >
      <div
        className={classes.FormatOption}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h1>{format.label}</h1>
        <div className={classes.content}>
          <Content
            option={format.option}
            onChange={(option) => setFormat({ ...format, option })}
          />
        </div>
        <div className={classes.buttonRow}>
          <button
            className={optionsClasses.primaryAction}
            onClick={() => onCancel?.()}
          >
            {sentenceCase(intl.cancel())}
          </button>
          <button
            className={optionsClasses.primaryAction}
            onClick={() => onOK?.(format.id, format.option)}
          >
            {intl.ok()}
          </button>
        </div>
      </div>
    </div>
  )
}
