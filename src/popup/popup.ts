import { copyTabs } from '@/copy'
import { FormatId } from '@/format'
import { getConfiguredFormat, getConfiguredFormats } from '@/configured-format'
import {
  getPrimaryFormatId,
  setPrimaryFormatId,
  setCopied,
  makeStorageChangeHandler,
} from '@/storage'
import { hasSecondaryActionKeyModifier, hasTernaryActionKeyModifier } from '@/keyboard'
import { intl } from '@/intl'
import { getTabs } from '@/util/tabs'
import { isButton, addListener } from '@/util/dom'
import { sentenceCase } from '@/util/string'

import './popup.css'

type CopyScope =
  | 'copy-tab' // represents all highlighted tabs in the current window (commonly just the current tab)
  | 'copy-window-tabs'
  | 'copy-all-tabs'

// ----- format overrides -----

type AltFormat = 'secondary' | 'ternary'

let oneTimeFormatId: FormatId | null = null // takes precedence
let altFormat: AltFormat | null = null

initApp()

function initApp() {
  const header = document.querySelector('header') as HTMLElement
  header.textContent = intl.copy()

  initCopyButtons()
  initFormats()

  const formatChanges = [
    'customFormatIds',
    'primaryFormatId',
    'orderedFormatIds',
    'unselectableFormatIds',
    'formatOptions',
  ]

  chrome.storage.onChanged.addListener(
    makeStorageChangeHandler(
      () => {
        refreshFormats()
      },
      {
        listen: formatChanges,
        throttle: 500,
      },
    ),
  )

  document.documentElement.addEventListener('mousedown', () => {
    closeFormatSelector()
  })
}

async function initCopyButtons() {
  const { highlighted: highlightedTabs } = await getTabs()

  const copyTabBtn = document.getElementById('copy-tab') as HTMLButtonElement
  const copyWindowTabsBtn = document.getElementById('copy-window-tabs') as HTMLButtonElement
  const copyAllTabsBtn = document.getElementById('copy-all-tabs') as HTMLButtonElement

  // ----- set copy tab button label -----

  copyTabBtn.textContent =
    highlightedTabs.length > 1 // wrap
      ? sentenceCase(intl.selectedTabs())
      : sentenceCase(intl.thisTab())

  // ----- set other button labels -----

  copyWindowTabsBtn.textContent = sentenceCase(intl.thisWindowsTabs())
  copyAllTabsBtn.textContent = sentenceCase(intl.allTabs())

  // ----- reveal UI -----

  document.getElementById('copy-buttons')!.style.display = ''

  copyTabBtn.focus()

  // ----- add event handlers -----

  const setAltFormatForKeys = (e: KeyboardEvent) => {
    if (isButton(e.currentTarget)) {
      setAltFormat(getAltFormat(e))
    }
  }

  const handleCopyClickOrKeydown = (e: MouseEvent | KeyboardEvent) => {
    if (isButton(e.currentTarget)) {
      setAltFormat(getAltFormat(e))
      const scope = e.currentTarget.getAttribute('id') as CopyScope
      handleCopy(scope)
    }
  }

  // while Enter key normally also fires click, modified (eg ctrl+) Enter will not. this handler responds to ANY Enter keydown, modified or not, and prevents duplicate events.
  const handleCopyKeydown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleCopyClickOrKeydown(e)
      e.preventDefault() // suppress click event (in case of non-modified Enter)
    }
  }

  const copyButtons = [copyTabBtn, copyWindowTabsBtn, copyAllTabsBtn]

  addListener(copyButtons, ['keydown', 'keyup'], setAltFormatForKeys)
  addListener(copyButtons, 'click', handleCopyClickOrKeydown)
  addListener(copyButtons, 'keydown', handleCopyKeydown)
  addListener(copyButtons, 'focus', closeFormatSelector)
  addListener(copyButtons, 'blur', clearAltFormat)

  // auto-focus button on hover. delay listener add to avoid auto-focus of a button that mouse cursor happens to be over on popup open.
  setTimeout(() => {
    addListener(copyButtons, 'mouseenter', (e) => {
      if (isButton(e.currentTarget)) {
        e.currentTarget.focus()
      }
    })
  }, 100)

  async function handleCopy(scope: CopyScope) {
    const tabs = await getTabs()

    const scopedTabs =
      scope === 'copy-tab'
        ? tabs.highlighted
        : scope === 'copy-window-tabs'
          ? tabs.inCurrentWin
          : tabs.all

    const format = await useFormat()

    try {
      await copyTabs(scopedTabs, format)
      flashActionIcon()
      // window.close()
    } catch (ex) {
      console.error(ex)

      const scopeButton = document.getElementById(scope) as HTMLButtonElement

      copyButtons.forEach(
        (button) => (button.style.backgroundColor = scopeButton === button ? '#7a2c2c' : ''),
      )
    }
  }
}

async function initFormats() {
  await refreshFormats()

  // handle format click (via event delegation)

  const handleFormatClickOrKeydown = async (e: MouseEvent | KeyboardEvent) => {
    if (isButton(e.target)) {
      const formatId = e.target.getAttribute('id') as FormatId
      const primaryFormatId = await getPrimaryFormatId()

      if (formatId === primaryFormatId) {
        oneTimeFormatId = null
        refreshFormats() // no db impact, so force refresh
      } else if (hasSecondaryActionKeyModifier(e)) {
        oneTimeFormatId = formatId
        refreshFormats() // no db impact, so force refresh
      } else {
        oneTimeFormatId = null
        setPrimaryFormatId(formatId)
      }

      closeFormatSelector()
      focusCopyTabBtn()
    }
  }

  // while Enter key normally also fires click, modified (eg ctrl+) Enter will not. this handler responds to ANY Enter keydown, modified or not, and prevents duplicate events.
  const handleFormatKeydown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleFormatClickOrKeydown(e)
      e.preventDefault() // suppress click event (in case of non-modified Enter)
    }
  }

  const formatSelector = document.getElementById('format-selector') as HTMLDivElement

  formatSelector.addEventListener('click', handleFormatClickOrKeydown)
  formatSelector.addEventListener('keydown', handleFormatKeydown)

  // auto-focus button on hover
  formatSelector.addEventListener('mouseover', (e) => {
    if (isButton(e.target)) {
      e.target.focus()
    }
  })

  // handle primary format click

  const primaryFormatBtn = document.getElementById('primary-format-btn') as HTMLButtonElement

  primaryFormatBtn.addEventListener('click', () => {
    toggleFormatSelector()
  })

  // suppress format selector close

  addListener([formatSelector, primaryFormatBtn], 'mousedown', (e) => {
    e.stopPropagation()
  })

  // reveal UI

  document.getElementById('format-section')!.style.display = ''
}

async function refreshFormats() {
  const selectableFormats = await getConfiguredFormats({ selectableOnly: true })

  const formatSelector = document.getElementById('format-selector') as HTMLDivElement
  const buttons = Array.from(formatSelector.querySelectorAll('button'))

  const focusedFormatId = buttons
    .find((button) => button === document.activeElement)
    ?.getAttribute('id')

  formatSelector.innerHTML = ''

  for (const format of selectableFormats) {
    if (
      (!oneTimeFormatId || oneTimeFormatId !== format.id) &&
      (oneTimeFormatId || !format.primary)
    ) {
      const button = document.createElement('button')

      button.setAttribute('id', format.id)
      button.classList.add('button-secondary')

      const span = document.createElement('span')
      span.classList.add('button-label')
      span.textContent = format.label
      button.appendChild(span)

      formatSelector.appendChild(button)

      if (format.id === focusedFormatId) {
        button.focus()
      }
    }
  }

  if (oneTimeFormatId && !selectableFormats.some(({ id }) => id === oneTimeFormatId)) {
    oneTimeFormatId = null
  }

  refreshFormatOverride()
}

async function refreshFormatOverride() {
  const copyAsLabel = document.getElementById('copy-as-label') as HTMLSpanElement
  copyAsLabel.textContent = sentenceCase(
    `${hasFormatOverride() ? intl.copy1xAs() : intl.copyAs()}:`,
  )

  const format = await useFormat()

  const primaryFormatLabel = document.getElementById('primary-format-label') as HTMLSpanElement
  primaryFormatLabel.textContent = format.label
}

function focusCopyTabBtn() {
  const copyTabBtn = document.getElementById('copy-tab') as HTMLButtonElement
  copyTabBtn.focus()
}

function toggleFormatSelector(expanded?: boolean) {
  const formatSection = document.getElementById('format-section') as HTMLDivElement
  formatSection.classList.toggle('expanded', expanded)
}

function closeFormatSelector() {
  toggleFormatSelector(false)
}

function flashActionIcon() {
  // using storage instead of `chrome.runtime` messaging because `window.close()` interrupts the message
  setCopied()
}

async function useFormat() {
  // oneTimeFormatId must take precedence over altFormat to avoid quirks related to auto focus of first copy button after a key-modified format selection
  if (oneTimeFormatId) {
    return getConfiguredFormat(oneTimeFormatId)
  }

  if (altFormat) {
    const selectableFormats = await getConfiguredFormats({ selectableOnly: true })
    const selectableNonPrimaryFormats = selectableFormats.filter(({ primary }) => !primary)

    return selectableNonPrimaryFormats[altFormat === 'secondary' ? 0 : 1]
  }

  return getConfiguredFormat(await getPrimaryFormatId())
}

function hasFormatOverride() {
  return !!oneTimeFormatId || !!altFormat
}

function getAltFormat(e: KeyboardEvent | MouseEvent): AltFormat | null {
  if (hasTernaryActionKeyModifier(e)) {
    return 'ternary'
  }

  if (hasSecondaryActionKeyModifier(e)) {
    return 'secondary'
  }

  return null
}

function clearAltFormat() {
  setAltFormat(null)
}

function setAltFormat(desiredAltFormat: AltFormat | null) {
  altFormat = desiredAltFormat
  refreshFormatOverride()
}
