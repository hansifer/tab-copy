import { copy } from '@/copy'
import { ScopeId } from '@/scope'
import { FormatId } from '@/format'
import { getConfiguredFormat, getConfiguredFormats } from '@/configured-format'
import { getOption } from '@/options'
import {
  // wrap
  getVisibleScopes,
  getDefaultFormatId,
  makeStorageChangeHandler,
} from '@/storage'
import { hasSecondaryActionModifierKey, hasTernaryActionModifierKey } from '@/keyboard'
import { intl } from '@/intl'
import {
  // wrap
  getTabs,
  getWindowAndTabCounts,
  onTabCountChanged,
  TabPredicate,
} from '@/util/tabs'
import {
  // wrap
  isButton,
  addListener,
  getSpan,
  getDiv,
  getButton,
  queryElement,
} from '@/util/dom'
import { serializer } from '@/util/async'
import { sentenceCase } from '@/util/string'

import './popup.css'

// ----- format overrides -----

type FormatVariation = 'secondary' | 'ternary'

let formatVariation: FormatVariation | null = null // set when modifier keys are engaged
let oneTimeFormatId: FormatId | null = null // set when selecting a non-default format. takes precedence over formatVariation during copy.

let keepFormatSelectorExpanded = false

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
    // wrap
    'customFormatIds',
    'orderedFormatIds',
    'hiddenFormatIds',
    'formatOpts',
  ]

  chrome.storage.onChanged.addListener(
    makeStorageChangeHandler(
      () => {
        refreshFormats({ refocus: true })
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
  const copyButtonsContainer = getDiv('copy-buttons')

  const visibleScopes = await getVisibleScopes()

  const highlightedTabs = await getTabs('highlighted-tabs')

  const tabsInfo = {
    highlightedTabCount: highlightedTabs.length,
  }

  for (const scope of visibleScopes) {
    const button = document.createElement('button')

    button.dataset.scope = scope.id
    button.classList.add('button-primary')
    button.textContent = sentenceCase(scope.label(tabsInfo))

    copyButtonsContainer.appendChild(button)
  }

  // ----- reveal UI -----

  copyButtonsContainer.style.removeProperty('display')

  const copyButtons = Array.from(copyButtonsContainer.children) as HTMLButtonElement[]

  copyButtons[0]?.focus()

  // ----- add event handlers -----

  const setFormatVariationPerModifierKeys = (e: KeyboardEvent) => {
    if (isButton(e.currentTarget)) {
      setFormatVariation(getFormatVariation(e))
    }
  }

  const handleCopyClickOrKeydown = async (e: MouseEvent | KeyboardEvent) => {
    const el = e.currentTarget // capture to account for mutation

    if (isButton(el)) {
      setFormatVariation(getFormatVariation(e))

      const scopeId = el.dataset.scope as ScopeId
      const format = await getApplicableFormat()

      try {
        await copy({ scopeId, format })

        window.close()
      } catch (ex) {
        console.error(ex)

        copyButtons.forEach(
          (button) => (button.style.backgroundColor = el === button ? '#7a2c2c' : ''),
        )
      }
    }
  }

  // while Enter key normally also fires click, modified (eg ctrl+) Enter will not. this handler responds to ANY Enter keydown, modified or not, and prevents duplicate events.
  const handleCopyKeydown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleCopyClickOrKeydown(e)
      e.preventDefault() // suppress click event (in case of non-modified Enter)
    }
  }

  addListener(copyButtons, ['keydown', 'keyup'], setFormatVariationPerModifierKeys)
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

  // ensure async calls don't overlap
  const enqueue = serializer()

  const optionsChanges = ['options']

  chrome.storage.onChanged.addListener(
    makeStorageChangeHandler(
      () => {
        enqueue(refreshCounts)
      },
      {
        listen: optionsChanges,
        throttle: 500,
      },
    ),
  )

  onTabCountChanged(() => {
    enqueue(refreshCounts)
  })

  enqueue(refreshCounts)
}

async function refreshCounts() {
  const showTabCounts = (await getOption('showTabCounts')).value

  const copyButtonsContainer = getDiv('copy-buttons')
  const copyButtons = Array.from(copyButtonsContainer.children) as HTMLButtonElement[]

  document.body.classList.toggle('with-counts', showTabCounts)

  if (!showTabCounts) {
    for (const button of copyButtons) {
      button.style.removeProperty('--count')
      button.classList.remove('single-digit-count')
      button.removeAttribute('disabled')
      button.removeAttribute('title')
    }

    return
  }

  const ignorePinnedTabs = (await getOption('ignorePinnedTabs')).value

  const filter: TabPredicate | undefined = ignorePinnedTabs // wrap
    ? ({ pinned }) => !pinned
    : undefined

  const counts = await getWindowAndTabCounts(filter)

  for (const button of copyButtons) {
    const scopeId = button.dataset.scope as ScopeId

    const count =
      scopeId === 'all-windows-and-tabs' // wrap
        ? counts['all-tabs']
        : counts[scopeId]

    if (scopeId === 'highlighted-tabs' && count === 1) {
      button.style.removeProperty('--count') // removing count sets badge `content` to `None`, effectively hiding it
    } else {
      // value needs to be in form '"123"'
      // not localizing counts. separators take space, which is at a premium.
      button.style.setProperty('--count', JSON.stringify(count.toString()))
    }

    button.classList.toggle('single-digit-count', count < 10)

    if (count) {
      button.toggleAttribute('disabled', false)
      button.removeAttribute('title')
    } else {
      button.toggleAttribute('disabled', true)
      button.setAttribute('title', intl.noTabsFound())
    }
  }
}

async function initFormats() {
  keepFormatSelectorExpanded = (await getOption('keepFormatSelectorExpanded')).value

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

      // timeout is needed in case of click when format selector is kept expanded since click focuses
      setTimeout(
        () => {
          queryElement('.button-primary')?.focus()
        },
        keepFormatSelectorExpanded ? 100 : 0,
      )
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

  const defaultFormatBtn = getButton('default-format-btn')

  if (!keepFormatSelectorExpanded) {
    // handle default format click
    defaultFormatBtn.addEventListener('click', () => {
      toggleFormatSelector()
    })

    // suppress format selector close
    addListener([formatSelector, defaultFormatBtn], 'mousedown', (e) => {
      e.stopPropagation()
    })
  }

  if (keepFormatSelectorExpanded) {
    defaultFormatBtn.classList.add('keep-expanded')
    defaultFormatBtn.setAttribute('disabled', 'disabled') // make unfocusable
  }

  toggleFormatSelector(keepFormatSelectorExpanded)

  // reveal UI

  getDiv('format-section').style.removeProperty('display')
}

function initKeyboardInteraction() {
  document.addEventListener('keydown', ({ code }: KeyboardEvent) => {
    if (code !== 'ArrowUp' && code !== 'ArrowDown') return

    const copyButtons = Array.from(getDiv('copy-buttons').children) as HTMLButtonElement[]

    const focusedButtonIdx = (copyButtons as ReadonlyArray<Element | null>).indexOf(
      document.activeElement,
    )

    const newButtonIdx = Math.min(
      copyButtons.length - 1,
      Math.max(0, focusedButtonIdx + (code === 'ArrowUp' ? -1 : 1)),
    )

    copyButtons[newButtonIdx]?.focus()
  })
}

async function refreshFormats({ refocus }: { refocus?: boolean } = {}) {
  const visibleFormats = await getConfiguredFormats({ visibleOnly: true })

  const formatSelector = getDiv('format-selector')
  const buttons = Array.from(formatSelector.querySelectorAll('button'))

  // capture focused format id before clearing formatSelector
  const focusedFormatId =
    refocus && buttons.find((button) => button === document.activeElement)?.getAttribute('id')

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

      if (focusedFormatId && format.id === focusedFormatId) {
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

  const format = await getApplicableFormat()

  getSpan('default-format-label').textContent = format.label
}

function toggleFormatSelector(expanded?: boolean) {
  getDiv('format-section').classList.toggle('expanded', expanded)
}

function closeFormatSelector() {
  if (!keepFormatSelectorExpanded) {
    toggleFormatSelector(false)
  }
}

async function getApplicableFormat() {
  // oneTimeFormatId must take precedence over formatVariation to avoid quirks related to auto focus of first copy button after a key-modified format selection
  if (oneTimeFormatId) {
    return getConfiguredFormat(oneTimeFormatId)
  }

  if (formatVariation) {
    const visibleFormats = await getConfiguredFormats({ visibleOnly: true })
    return visibleFormats[formatVariation === 'secondary' ? 1 : 2] // visibleFormats[0] is the default format
  }

  return getConfiguredFormat(await getDefaultFormatId())
}

function hasFormatOverride() {
  return !!(oneTimeFormatId || formatVariation)
}

function getFormatVariation(e: KeyboardEvent | MouseEvent): FormatVariation | null {
  if (hasTernaryActionModifierKey(e)) {
    return 'ternary'
  }

  if (hasSecondaryActionModifierKey(e)) {
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
