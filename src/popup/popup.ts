import { copyTabs } from '@/copy'
import { FormatId } from '@/format'
import { getConfiguredFormat, getConfiguredFormats } from '@/configured-format'
import {
  // wrap
  getDefaultFormatId,
  setCopied,
  makeStorageChangeHandler,
} from '@/storage'
import { hasSecondaryActionKeyModifier, hasTernaryActionKeyModifier } from '@/keyboard'
import { intl } from '@/intl'
import { getTabs } from '@/util/tabs'
import {
  // wrap
  isButton,
  addListener,
  getSpan,
  getDiv,
  getButton,
  queryElement,
} from '@/util/dom'
import { sentenceCase } from '@/util/string'

import './popup.css'

type CopyScope =
  | 'copy-tab' // represents all highlighted tabs in the current window (commonly just the current tab)
  | 'copy-window-tabs'
  | 'copy-all-tabs'

// ----- format overrides -----

type FormatVariation = 'secondary' | 'ternary'

let formatVariation: FormatVariation | null = null // set when key modifiers are engaged
let oneTimeFormatId: FormatId | null = null // set when selecting a non-default format. takes precedence over formatVariation during copy.

initApp()

function initApp() {
  getDiv('header-text').textContent = intl.copy()

  getSpan('options-button-text').textContent = sentenceCase(intl.options())
  getButton('options-button').addEventListener('click', () => {
    chrome.runtime.openOptionsPage()
  })

  initCopyButtons()
  initFormats()
  initKeyboardInteraction()

  const formatChanges = [
    'customFormatIds',
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

  const copyTabBtn = getButton('copy-tab')
  const copyWindowTabsBtn = getButton('copy-window-tabs')
  const copyAllTabsBtn = getButton('copy-all-tabs')

  // ----- set copy button labels -----

  copyTabBtn.textContent = sentenceCase(
    highlightedTabs.length > 1 // wrap
      ? intl.selectedTabs()
      : intl.thisTab(),
  )

  copyWindowTabsBtn.textContent = sentenceCase(intl.thisWindowsTabs())
  copyAllTabsBtn.textContent = sentenceCase(intl.allTabs())

  // ----- reveal UI -----

  getDiv('copy-buttons')!.style.display = ''

  copyTabBtn.focus()

  // ----- add event handlers -----

  const setFormatVariationPerKeyModifiers = (e: KeyboardEvent) => {
    if (isButton(e.currentTarget)) {
      setFormatVariation(getFormatVariation(e))
    }
  }

  const handleCopyClickOrKeydown = (e: MouseEvent | KeyboardEvent) => {
    if (isButton(e.currentTarget)) {
      setFormatVariation(getFormatVariation(e))
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

  addListener(copyButtons, ['keydown', 'keyup'], setFormatVariationPerKeyModifiers)
  addListener(copyButtons, 'click', handleCopyClickOrKeydown)
  addListener(copyButtons, 'keydown', handleCopyKeydown)
  addListener(copyButtons, 'focus', closeFormatSelector)
  addListener(copyButtons, 'blur', clearFormatVariation)

  // auto-focus button on hover. delay listener add to avoid auto-focus of a button that mouse cursor happens to be over on popup open.
  setTimeout(() => {
    addListener(copyButtons, 'mouseenter', (e) => {
      if (isButton(e.currentTarget) && !e.buttons) {
        // !e.buttons prevents focus on drag
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

    const format = await getEffectiveFormat()

    try {
      await copyTabs(scopedTabs, format)
      flashActionIcon()
      window.close()
    } catch (ex) {
      console.error(ex)

      const scopeButton = getButton(scope)

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
      const defaultFormatId = await getDefaultFormatId()

      oneTimeFormatId =
        formatId === defaultFormatId // wrap
          ? null
          : formatId

      refreshFormats() // no db impact, so force refresh
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

  const formatSelector = getDiv('format-selector')

  formatSelector.addEventListener('click', handleFormatClickOrKeydown)
  formatSelector.addEventListener('keydown', handleFormatKeydown)

  // auto-focus button on hover
  formatSelector.addEventListener('mouseover', (e) => {
    if (isButton(e.target) && !e.buttons) {
      // !e.buttons prevents focus on drag
      e.target.focus()
    }
  })

  // handle default format click

  const defaultFormatBtn = getButton('default-format-btn')

  defaultFormatBtn.addEventListener('click', () => {
    toggleFormatSelector()
  })

  // suppress format selector close

  addListener([formatSelector, defaultFormatBtn], 'mousedown', (e) => {
    e.stopPropagation()
  })

  // reveal UI

  getDiv('format-section')!.style.display = ''
}

function initKeyboardInteraction() {
  document.addEventListener('keydown', ({ code }: KeyboardEvent) => {
    const copyTabBtn = getButton('copy-tab')
    const copyWindowTabsBtn = getButton('copy-window-tabs')
    const copyAllTabsBtn = getButton('copy-all-tabs')

    if (code === 'ArrowUp') {
      if (document.activeElement === copyAllTabsBtn) {
        copyWindowTabsBtn.focus()
      } else if (document.activeElement === copyWindowTabsBtn) {
        copyTabBtn.focus()
      } else {
        // copyTabBtn or no copy button is focused
        copyTabBtn.focus()
      }
    } else if (code === 'ArrowDown') {
      if (document.activeElement === copyTabBtn) {
        copyWindowTabsBtn.focus()
      } else if (document.activeElement === copyWindowTabsBtn) {
        copyAllTabsBtn.focus()
      } else if (document.activeElement !== copyAllTabsBtn) {
        // no copy button is focused
        copyTabBtn.focus()
      }
    }
  })
}

async function refreshFormats() {
  const visibleFormats = await getConfiguredFormats({ selectableOnly: true })

  const formatSelector = getDiv('format-selector')
  const buttons = Array.from(formatSelector.querySelectorAll('button'))

  // capture focused format id before clearing formatSelector
  const focusedFormatId = buttons
    .find((button) => button === document.activeElement)
    ?.getAttribute('id')

  formatSelector.innerHTML = ''

  for (const format of visibleFormats) {
    if (oneTimeFormatId ? oneTimeFormatId !== format.id : !format.isDefault) {
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

  if (oneTimeFormatId && !visibleFormats.some(({ id }) => id === oneTimeFormatId)) {
    oneTimeFormatId = null
  }

  refreshEffectiveFormat()
}

async function refreshEffectiveFormat() {
  getSpan('copy-as-label').textContent = sentenceCase(
    `${
      hasFormatOverride() // wrap
        ? intl.copy1xAs()
        : intl.copyAs()
    }:`,
  )

  const format = await getEffectiveFormat()

  getSpan('default-format-label').textContent = format.label
}

function focusCopyTabBtn() {
  getButton('copy-tab').focus()
}

function toggleFormatSelector(expanded?: boolean) {
  getDiv('format-section').classList.toggle('expanded', expanded)
}

function closeFormatSelector() {
  toggleFormatSelector(false)
}

function flashActionIcon() {
  // using storage instead of `chrome.runtime` messaging because `window.close()` interrupts the message
  setCopied()
}

async function getEffectiveFormat() {
  // oneTimeFormatId must take precedence over formatVariation to avoid quirks related to auto focus of first copy button after a key-modified format selection
  if (oneTimeFormatId) {
    return getConfiguredFormat(oneTimeFormatId)
  }

  if (formatVariation) {
    const visibleFormats = await getConfiguredFormats({ selectableOnly: true })
    return visibleFormats[formatVariation === 'secondary' ? 1 : 2] // visibleFormats[0] is the default format
  }

  return getConfiguredFormat(await getDefaultFormatId())
}

function hasFormatOverride() {
  return !!(oneTimeFormatId || formatVariation)
}

function getFormatVariation(e: KeyboardEvent | MouseEvent): FormatVariation | null {
  if (hasTernaryActionKeyModifier(e)) {
    return 'ternary'
  }

  if (hasSecondaryActionKeyModifier(e)) {
    return 'secondary'
  }

  return null
}

function clearFormatVariation() {
  setFormatVariation(null)
}

function setFormatVariation(variation: FormatVariation | null) {
  formatVariation = variation
  refreshEffectiveFormat()
}
