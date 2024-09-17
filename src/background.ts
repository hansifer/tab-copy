import { getOption } from '@/options'
import { makeStorageChangeHandler, CopyStatus, CopyType } from '@/storage'
import { getConfiguredFormat } from '@/configured-format'
import { offscreenActions } from '@/offscreen-actions'
import { notification } from '@/util/notification'
import { sentenceCase } from '@/util/string'
import { log } from '@/util/log'
import { intl } from '@/intl'

import { refreshMenus, handleMenuAction } from './copy-menus'

let prefersColorSchemeDarkCache: boolean | null = null

const copyNotification = notification('copy')

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

chrome.storage.onChanged.addListener(
  makeStorageChangeHandler((changes) => {
    // listening for `copyStatus` storage event instead of using `chrome.runtime` messaging because popup `window.close()` interrupts the message
    if (changes.copyStatus?.newValue) {
      clearTimeout(actionIconFlashTimer)

      const { status, type, count, formatId } = changes.copyStatus.newValue as CopyStatus

      const success = status === 'success'

      if (success) {
        log(`${count ? `${count} ` : ''}${count === 1 ? type : `${type}s`} copied as ${formatId}`)
      } else {
        console.warn(`failed to copy type ${type} as ${formatId}`)
      }

      setIcon(success ? 'success' : 'fail')

      actionIconFlashTimer = setTimeout(() => {
        setIcon('logo')
      }, 1e3)

      getOption('notifyOnCopy').then(async ({ value: notify }) => {
        if (notify) {
          try {
            const typeLabel = getCopyTypeLabel(type)

            copyNotification.notify(
              success
                ? {
                    iconUrl: 'img/success-128.png',
                    title: sentenceCase(
                      intl.copySuccess({
                        count,
                        typeLabel,
                      }),
                    ),
                    message: sentenceCase(
                      intl.copySuccess({
                        count,
                        typeLabel,
                        formatLabel: (await getConfiguredFormat(formatId)).label,
                      }),
                    ),
                  }
                : {
                    iconUrl: 'img/fail-128.png',
                    message: sentenceCase(intl.copyFail()),
                  },
            )
          } catch (ex) {
            console.error('notification error', ex)
          }
        }
      })
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
  if (prefersColorSchemeDarkCache === null) {
    try {
      prefersColorSchemeDarkCache = await offscreenActions.prefersColorSchemeDark()
    } catch (ex) {
      console.error('failed to get theme preference (error sending offscreen action).', ex)
    }
  }

  return prefersColorSchemeDarkCache ?? false
}

function getCopyTypeLabel(type: CopyType): (count?: number) => string {
  switch (type) {
    case 'tab':
      return intl.tab

    case 'window':
      return intl.window

    case 'link':
      return intl.link

    case 'image':
      return intl.image

    case 'video':
      return intl.video

    case 'audio':
      return intl.audio

    default:
      return intl.unknown
  }
}
