import { useState, useEffect, useCallback } from 'react'
import { Reorder } from 'framer-motion'

import { BinaryOption } from './BinaryOption/BinaryOption'
import { FormatConfig } from './FormatConfig/FormatConfig'
import { FormatOption } from './FormatOption/FormatOption'
import { BooleanOptionId, options } from '@/options'
import { MIN_SELECTABLE_FORMAT_COUNT, FormatId, FormatWithOptionId } from '@/format'
import { getConfiguredFormats, ConfiguredFormat } from '@/configured-format'
import {
  setOrderedFormatIds,
  toggleSelectableFormatId,
  addCustomFormat,
  makeStorageChangeHandler,
  setFormatOption,
} from '@/storage'
import { getSecondaryActionKeyModifierLabel, getTernaryActionKeyModifierLabel } from '@/keyboard'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

import classes from './Options.module.css'

// todo: consider useSyncExternalStore instead of useState, useEffect (possible because storage api has snapshot and subscription features)
export const Options = () => {
  const [configuredFormats, setConfiguredFormats] = useState<ConfiguredFormat<FormatId>[]>([])
  // formatId associated with format option being edited
  const [optionEditFormatId, setOptionEditFormatId] = useState<FormatWithOptionId>()

  const refreshConfiguredFormats = useCallback(() => {
    getConfiguredFormats().then(setConfiguredFormats)
  }, [])

  useEffect(() => {
    refreshConfiguredFormats()
  }, [refreshConfiguredFormats])

  useEffect(() => {
    const handleStorageChanged = makeStorageChangeHandler(refreshConfiguredFormats)

    chrome.storage.onChanged.addListener(handleStorageChanged)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChanged)
    }
  }, [refreshConfiguredFormats])

  const selectableFormats = configuredFormats.filter(({ selectable }) => selectable)

  const isMinSelectableFormatCount = selectableFormats.length <= MIN_SELECTABLE_FORMAT_COUNT

  const selectableNonPrimaryFormatIds = selectableFormats
    .filter(({ primary }) => !primary)
    .map(({ id }) => id)

  return (
    <main>
      <h3>{intl.tabCopyOptions()}</h3>
      <div className={classes.generalSection}>
        {Object.entries(options)
          .filter(([, defaultVal]) => defaultVal === true || defaultVal === false) // only consider boolean options
          .map(([optionId]) => (
            <BinaryOption
              key={optionId}
              id={optionId as BooleanOptionId}
            />
          ))}
        {sentenceCase(intl.shortcutKey())}
      </div>
      <div className={classes.formatsSection}>
        <h3>{intl.formats()}</h3>
        <div className={classes.formatsInstructions}>{getFormatsInstructions()}</div>
        <button
          className={classes.primaryAction}
          onClick={addCustomFormat}
        >
          {sentenceCase(intl.addFormat())}
        </button>
        <Reorder.Group
          axis="y"
          values={configuredFormats}
          onReorder={(configuredFormats) =>
            setOrderedFormatIds(configuredFormats.map(({ id }) => id))
          }
        >
          {configuredFormats.map((format) => (
            <FormatConfig
              key={format.id}
              format={format}
              description={getFormatDescription(format, selectableNonPrimaryFormatIds)}
              disabled={format.selectable && isMinSelectableFormatCount}
              onClick={toggleSelectableFormatId}
              onOptionClick={setOptionEditFormatId}
            />
          ))}
        </Reorder.Group>
      </div>
      <FormatOption
        formatId={optionEditFormatId}
        onCancel={() => {
          setOptionEditFormatId(undefined)
        }}
        onOK={(formatId, option) => {
          setFormatOption(formatId, option)
          setOptionEditFormatId(undefined)
        }}
      />
    </main>
  )
}

function getFormatDescription(
  format: ConfiguredFormat<FormatId>,
  selectableNonPrimaryFormatIds: FormatId[],
) {
  if (!format.selectable) {
    return sentenceCase(intl.hidden())
  }

  if (format.primary) {
    return sentenceCase(intl.primary())
  }

  const idx = selectableNonPrimaryFormatIds.indexOf(format.id)

  if (idx === 0) {
    return sentenceCase(intl.holdWhenCopying(getSecondaryActionKeyModifierLabel()))
  }

  if (idx === 1) {
    return sentenceCase(intl.holdWhenCopying(getTernaryActionKeyModifierLabel()))
  }
}

function getFormatsInstructions() {
  return `${sentenceCase(intl.formatReorderInstructions())}
  
  ${sentenceCase(intl.formatMakeUnselectableInstructions())}
  
  ${sentenceCase(intl.formatSetPrimaryInstructions())}`
}
