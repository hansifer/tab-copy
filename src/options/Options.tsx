import { useState, useEffect, useCallback } from 'react'
import { Reorder } from 'framer-motion'

import { BinaryOption } from './BinaryOption/BinaryOption'
import { FormatConfig } from './FormatConfig/FormatConfig'
import { FormatOptionEditor } from './FormatOptionEditor/FormatOptionEditor'
import { OptionTip } from './OptionTip/OptionTip'
import { Logo } from '@/Logo'
import { BooleanOptionId, options } from '@/options'
import { formatOptionTips, getOptionTipText } from '@/option-tips'
import {
  MIN_SELECTABLE_FORMAT_COUNT,
  isCustomFormatId,
  FormatId,
  FormatWithOptionId,
} from '@/format'
import { getConfiguredFormats, ConfiguredFormat } from '@/configured-format'
import {
  setOrderedFormatIds,
  toggleSelectableFormatId,
  addCustomFormat,
  makeStorageChangeHandler,
  setFormatOption,
  removeCustomFormat,
  MinSelectableFormatExceededError,
  getHiddenOptionTipIds,
  hideOptionTip,
} from '@/storage'
import { getSecondaryActionKeyModifierLabel, getTernaryActionKeyModifierLabel } from '@/keyboard'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'
import { prefersColorSchemeDark } from '@/util/css'

import classes from './Options.module.css'

// todo: remove after this bug is fixed: https://github.com/facebook/react/pull/24730
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    inert?: 'true'
  }
}

// todo: consider useSyncExternalStore instead of useState, useEffect (possible because storage api has snapshot and subscription features)
export const Options = () => {
  const [configuredFormats, setConfiguredFormats] = useState<ConfiguredFormat<FormatId>[]>([])
  // formatId associated with format option being edited
  const [optionEditFormatId, setOptionEditFormatId] = useState<FormatWithOptionId>()

  const [editError, setEditError] = useState<string>('')

  const [visibleFormatOptionTips, setVisibleFormatOptionTips] = useState<
    (typeof formatOptionTips)[number][]
  >([])

  const refreshVisibleOptionTips = useCallback(() => {
    getHiddenOptionTipIds().then((hiddenOptionTipIds) => {
      setVisibleFormatOptionTips(
        formatOptionTips.filter(({ id }) => !hiddenOptionTipIds.includes(id)),
      )
    })
  }, [setVisibleFormatOptionTips])

  const refreshConfiguredFormats = useCallback(() => {
    getConfiguredFormats().then(setConfiguredFormats)
  }, [setConfiguredFormats])

  const applyStorageState = useCallback(() => {
    refreshVisibleOptionTips()
    refreshConfiguredFormats()
  }, [refreshVisibleOptionTips, refreshConfiguredFormats])

  // apply storage state on mount
  useEffect(() => {
    applyStorageState()
  }, [applyStorageState])

  // apply storage state when storage changes
  useEffect(() => {
    const handleStorageChanged = makeStorageChangeHandler(applyStorageState)

    chrome.storage.onChanged.addListener(handleStorageChanged)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChanged)
    }
  }, [applyStorageState])

  const selectableFormats = configuredFormats.filter(({ selectable }) => selectable)

  const isMinSelectableFormatCount = selectableFormats.length <= MIN_SELECTABLE_FORMAT_COUNT

  const inert = optionEditFormatId ? 'true' : undefined //  todo: update to boolean after this bug is fixed: https://github.com/facebook/react/pull/24730

  const closeFormatOptionEditor = () => {
    setOptionEditFormatId(undefined)
    setEditError('')
  }

  const deleteFormat = async (formatId: FormatWithOptionId) => {
    try {
      if (isCustomFormatId(formatId)) {
        await removeCustomFormat(formatId)
        closeFormatOptionEditor()
      } else {
        setEditError(sentenceCase(intl.genericFormatDeleteError()))
      }
    } catch (ex) {
      console.error(ex)

      setEditError(
        sentenceCase(
          ex instanceof MinSelectableFormatExceededError
            ? intl.minSelectableFormatDeleteError()
            : intl.genericFormatDeleteError(),
        ),
      )
    }
  }

  return (
    <main>
      <div className={classes.header}>
        <Logo
          size={48}
          lineColor={prefersColorSchemeDark() ? undefined : '#fff'} // not reactive but ok for now
        />
        <h3>{intl.tabCopyOptions()}</h3>
      </div>
      <div
        className={classes.generalSection}
        inert={inert}
      >
        <div className={classes.generalSubSection}>
          {Object.entries(options)
            .filter(([, defaultVal]) => defaultVal === true || defaultVal === false) // only consider boolean options
            .map(([optionId]) => (
              <BinaryOption
                key={optionId}
                id={optionId as BooleanOptionId}
              />
            ))}
        </div>
        <button
          className={classes.primaryAction}
          onClick={() => {
            chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 8h.01" />
            <path d="M12 12h.01" />
            <path d="M14 8h.01" />
            <path d="M16 12h.01" />
            <path d="M18 8h.01" />
            <path d="M6 8h.01" />
            <path d="M7 16h10" />
            <path d="M8 12h.01" />
            <rect
              width="20"
              height="16"
              x="2"
              y="4"
              rx="2"
            />
          </svg>
          {sentenceCase(intl.editKeyboardShortcuts())}
        </button>
      </div>
      <div
        className={classes.formatsSection}
        inert={inert}
      >
        <h3>{intl.formats()}</h3>
        {visibleFormatOptionTips.length ? (
          <div className={classes.formatOptionTips}>
            {visibleFormatOptionTips.map(({ id, icon }) => (
              <OptionTip
                key={id}
                icon={icon}
                text={sentenceCase(getOptionTipText(id))}
                onDismiss={() => {
                  hideOptionTip(id)
                }}
              />
            ))}
          </div>
        ) : null}
        <button
          className={classes.primaryAction}
          onClick={addCustomFormat}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginRight: '6px' }}
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          {sentenceCase(intl.addFormat())}
        </button>
        <div className={classes.formats}>
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
                description={getFormatDescription(format, selectableFormats)}
                disabled={format.selectable && isMinSelectableFormatCount}
                onClick={toggleSelectableFormatId}
                onOptionClick={setOptionEditFormatId}
              />
            ))}
          </Reorder.Group>
        </div>
      </div>
      <FormatOptionEditor
        key={optionEditFormatId} // force remount to clear deleteMode
        error={editError}
        formatId={optionEditFormatId}
        onCancel={() => {
          closeFormatOptionEditor()
        }}
        onOK={(formatId, option) => {
          setFormatOption(formatId, option)
          closeFormatOptionEditor()
        }}
        onDelete={(formatId) => {
          deleteFormat(formatId)
        }}
      />
    </main>
  )
}

function getFormatDescription(
  format: ConfiguredFormat<FormatId>,
  selectableFormats: ConfiguredFormat<FormatId>[],
) {
  if (!format.selectable) {
    return sentenceCase(intl.hidden())
  }

  const idx = selectableFormats.findIndex(({ id }) => id === format.id)

  if (idx === 0) {
    return sentenceCase(intl.default())
  }

  if (idx === 1) {
    return sentenceCase(intl.holdWhenCopying(getSecondaryActionKeyModifierLabel()))
  }

  if (idx === 2) {
    return sentenceCase(intl.holdWhenCopying(getTernaryActionKeyModifierLabel()))
  }
}
