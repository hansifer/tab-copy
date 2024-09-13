import { getOption } from '@/options'
import { makeStorageChangeHandler } from '@/storage'
import { offscreenActions } from '@/offscreen-actions'
import { log } from '@/util/log'

import { refreshMenus, handleMenuAction } from './copy-menus'

let prefersColorSchemeDarkCache: boolean | null = null

let actionIconFlashTimer: ReturnType<typeof setTimeout>

log(`service worker loaded ${new Date().toLocaleString()}`)

chrome.runtime.onInstalled.addListener(() => {
  refreshMenus()
})

// fires on leaf nodes and branch nodes with empty `items`
chrome.contextMenus.onClicked.addListener(handleMenuAction)

setIcon('logo')

chrome.runtime.onStartup.addListener(() => {
  setIcon('logo')
})

// listening for `copied` storage event instead of using `chrome.runtime` messaging because `window.close()` interrupts the message
chrome.storage.onChanged.addListener(
  makeStorageChangeHandler((changes) => {
    if (changes.copied) {
      clearTimeout(actionIconFlashTimer)

      setIcon('success')

      actionIconFlashTimer = setTimeout(() => {
        setIcon('logo')
      }, 1e3)
    }

    if (changes.options) {
      setIcon('logo')
    }
  }),
)

const optionAndFormatChanges = [
  'options',
  'customFormatIds',
  'orderedFormatIds',
  'hiddenFormatIds',
  'formatOpts',
]

chrome.storage.onChanged.addListener(
  makeStorageChangeHandler(
    () => {
      refreshMenus()
    },
    {
      listen: optionAndFormatChanges,
      throttle: 1_000, // use debounce instead (once supported)
    },
  ),
)

async function setIcon(name: 'logo' | 'success' | 'fail') {
  const filename =
    name === 'fail' // wrap
      ? 'fail'
      : name === 'success'
        ? 'success'
        : await getLogoIconFilename()

  return chrome.action.setIcon({
    path: {
      16: `img/${filename}-16.png`,
      32: `img/${filename}-32.png`,
      48: `img/${filename}-48.png`,
      128: `img/${filename}-128.png`,
    },
  })
}

async function getLogoIconFilename() {
  // limitation: dark mode detection works fine in most cases except when the user has explicitly selected "Light" or "Dark" in Chrome `Settings > Appearance` and the system theme is the opposite of what was selected. we can only programmatically query the system theme.
  const darkMode = await getPrefersColorSchemeDark()
  const invertIcon = (await getOption('invertIcon')).value

  return (darkMode && !invertIcon) || (!darkMode && invertIcon)
    ? 'logo-outline-white'
    : 'logo-outline-black'
}

async function getPrefersColorSchemeDark() {
  return prefersColorSchemeDarkCache === null
    ? (prefersColorSchemeDarkCache = await offscreenActions.prefersColorSchemeDark())
    : prefersColorSchemeDarkCache
}
