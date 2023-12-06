import { useState, useEffect, useCallback } from 'react'
import { Reorder } from 'framer-motion'

import { BinaryOption } from './BinaryOption'
import { FormatOption } from './FormatOption'
import { BooleanOptionId, options } from '@/options'
import {
  getConfiguredFormats,
  MIN_SELECTABLE_FORMAT_COUNT,
  ConfiguredFormat,
  FormatId,
} from '@/formats'
import { setOrderedFormatIds, toggleSelectableFormatId, makeStorageChangeHandler } from '@/storage'
import { getSecondaryActionKeyModifierLabel, getTernaryActionKeyModifierLabel } from '@/keyboard'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

import classes from './Options.module.css'

// todo: consider useSyncExternalStore instead of useState, useEffect (possible because storage api has snapshot and subscription features)
export const Options = () => {
  const [configuredFormats, setConfiguredFormats] = useState<ConfiguredFormat[]>([])

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
        <h4>{sentenceCase(intl.formats())}</h4>
        <div className={classes.formatsInstructions}>{getFormatsInstructions()}</div>
        <Reorder.Group
          axis="y"
          values={configuredFormats}
          onReorder={(configuredFormats) =>
            setOrderedFormatIds(configuredFormats.map(({ id }) => id))
          }
        >
          {configuredFormats.map((format) => (
            <FormatOption
              key={format.id}
              format={format}
              description={getFormatDescription(format, selectableNonPrimaryFormatIds)}
              disabled={format.selectable && isMinSelectableFormatCount}
              onClick={toggleSelectableFormatId}
              onConfigClick={(id) => {
                // todo: implement
                console.log(id)
              }}
            />
          ))}
        </Reorder.Group>
      </div>
    </main>
  )
}

function getFormatDescription(format: ConfiguredFormat, selectableNonPrimaryFormatIds: FormatId[]) {
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
