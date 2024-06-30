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
  error?: string
  onCancel: () => void
  onOK: (formatId: T, option: FormatOptions[T]) => void
  onDelete?: (formatId: T) => void
}

export const FormatOption = <T extends FormatWithOptionId>({
  formatId,
  error,
  onCancel,
  onOK,
  onDelete,
}: FormatOptionProps<T>) => {
  const [format, setFormat] = useState<ConfiguredFormat<T>>()

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  useEffect(() => {
    if (formatId) {
      getConfiguredFormat(formatId).then(setFormat)
    } else {
      setFormat(undefined)
    }
  }, [formatId])

  if (!format) return null

  const content = error ? (
    <div className={classes.contentMessage}>{error}</div>
  ) : confirmDelete ? (
    <div className={classes.contentMessage}>{sentenceCase(intl.confirmDelete())}</div>
  ) : (
    (() => {
      // todo: eliminate need for TS assertion
      const ContentComp = (isBuiltInFormatWithOptionId(format.id)
        ? builtInFormatOptionContent[format.id]
        : Custom) as unknown as FC<ContentProps<T>>

      return (
        <ContentComp
          option={format.option}
          onChange={(option) => setFormat({ ...format, option })}
          onConfirmDelete={() => setConfirmDelete(true)}
        />
      )
    })()
  )

  const buttons = error ? (
    <>
      <button
        className={optionsClasses.primaryAction}
        onClick={() => onCancel()}
      >
        {sentenceCase(intl.ok())}
      </button>
    </>
  ) : confirmDelete ? (
    <>
      <button
        className={optionsClasses.primaryAction}
        onClick={() => setConfirmDelete(false)}
      >
        {sentenceCase(intl.no())}
      </button>
      <button
        className={optionsClasses.primaryAction}
        onClick={() => onDelete?.(format.id)}
      >
        {sentenceCase(intl.yes())}
      </button>
    </>
  ) : (
    <>
      <button
        className={optionsClasses.primaryAction}
        onClick={() => onCancel()}
      >
        {sentenceCase(intl.cancel())}
      </button>
      <button
        className={optionsClasses.primaryAction}
        onClick={() => onOK(format.id, format.option)}
      >
        {intl.ok()}
      </button>
    </>
  )

  return (
    <div
      className={classes.backdrop}
      onMouseDown={() => onCancel()}
    >
      <div
        className={classes.FormatOption}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h1>{format.label}</h1>
        <div className={classes.content}>{content}</div>
        <div className={classes.buttonRow}>{buttons}</div>
      </div>
    </div>
  )
}
