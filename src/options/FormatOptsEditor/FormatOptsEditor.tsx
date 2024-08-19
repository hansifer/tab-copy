import { useState, useEffect, FC } from 'react'

import {
  isBuiltinFormatWithOptsId,
  BuiltinFormatWithOptsId,
  FormatWithOptsId,
  FormatOpts,
} from '@/format'
import { getConfiguredFormat, ConfiguredFormat } from '@/configured-format'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

import { ContentProps } from './content/interface'
import { HtmlTable } from './content/HtmlTable'
import { TitleUrl1Line } from './content/TitleUrl1Line'
import { Json } from './content/Json'
import { Custom } from './content/Custom'

import classes from './FormatOptsEditor.module.css'
import optionsClasses from '../Options.module.css'

const builtinFormatOptionContent = {
  htmlTable: HtmlTable,
  titleUrl1Line: TitleUrl1Line,
  json: Json,
} satisfies { [k in BuiltinFormatWithOptsId]: FC<ContentProps<k>> }

type FormatOptsEditorProps<T extends FormatWithOptsId> = {
  formatId?: T
  error?: string
  onCancel: () => void
  onOK: (formatId: T, opts: FormatOpts[T]) => void
  onDelete?: (formatId: T) => void
}

export const FormatOptsEditor = <T extends FormatWithOptsId>({
  formatId,
  error,
  onCancel,
  onOK,
  onDelete,
}: FormatOptsEditorProps<T>) => {
  const [format, setFormat] = useState<ConfiguredFormat<T>>()

  const [okDisabled, setOKDisabled] = useState<boolean>(false)
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  useEffect(() => {
    if (formatId) {
      getConfiguredFormat(formatId).then(setFormat)
    } else {
      setFormat(undefined)
    }
  }, [formatId])

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      } else if (e.key === 'Enter') {
        if (
          !okDisabled && // wrap
          format &&
          e.target instanceof Element &&
          e.target.tagName === 'INPUT'
        ) {
          onOK(format.id, format.opts)
        }
      }
    }

    document.addEventListener('keydown', keydownHandler)

    return () => {
      document.removeEventListener('keydown', keydownHandler)
    }
  }, [onCancel, onOK, format, okDisabled])

  if (!format) return null

  const content = error ? (
    <div className={classes.contentMessage}>{error}</div>
  ) : confirmDelete ? (
    <div className={classes.contentMessage}>{sentenceCase(intl.confirmDelete())}</div>
  ) : (
    (() => {
      // todo: eliminate need for TS assertion
      const ContentComp = (isBuiltinFormatWithOptsId(format.id)
        ? builtinFormatOptionContent[format.id]
        : Custom) as unknown as FC<ContentProps<T>>

      return (
        <ContentComp
          opts={format.opts}
          onChange={(opts) => setFormat({ ...format, opts })}
          onConfirmDelete={() => setConfirmDelete(true)}
          onValidChanged={(valid) => {
            setOKDisabled(!valid)
          }}
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
        {intl.ok()}
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
        onClick={() => {
          onOK(format.id, format.opts)
        }}
        disabled={okDisabled}
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
        className={classes.FormatOptsEditor}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h1>{format.label}</h1>
        <div className={classes.content}>{content}</div>
        <div className={classes.buttons}>{buttons}</div>
      </div>
    </div>
  )
}
